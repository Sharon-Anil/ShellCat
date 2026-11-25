import crypto from 'node:crypto';

interface ContactPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  website: string;
  message: string;
  consent: boolean;
  honeypot: string;
  turnstileToken: string;
}

const RATE_WINDOW_SECONDS = 600; // 10 minutes
const RATE_MAX_REQUESTS = 5;
const memoryRateStore = new Map<string, { count: number; resetAt: number }>();

const ALLOWED_SERVICES = new Set([
  'SHELLCAT WEB CHECK (Starting at ₹10,000)',
  'SHELLCAT WEB VAPT (Starting at ₹25,000)',
  'SHELLCAT WEB + API SECURITY (Starting at ₹40,000)',
  'SHELLCAT NETWORK DEFENCE (Starting at ₹30,000)',
  'SHELLCAT RED TEAM (Starting at ₹1,00,000)',
  'SHELLCAT SECURITY CARE (Starting at ₹7,500/month)',
  'Website Penetration Testing (VAPT)',
  'Web Application Security Testing',
  'API Security Testing',
  'Network Security Assessment',
  'Red Team Assessment',
  'Cloud Security Assessment',
  'Mobile Application Security Testing',
  'Malware Analysis',
  'Security Auditing',
  'Incident Investigation',
  'Business Website Development',
  'E-commerce Development',
  'Custom Web Application Development',
  'SaaS Product Development',
  'SHELLCAT STARTER Website Package (₹30,000)',
  'SHELLCAT PROFESSIONAL Website Package (₹60,000)',
  'SHELLCAT BUSINESS PLUS Package (₹1,20,000)',
  'SHELLCAT CARE Monthly Protection (₹3,000/month)',
  'SHELLCAT SHIELD Monthly Protection (₹7,500/month)',
  'SHELLCAT COMPLETE Monthly Protection (₹15,000/month)',
  'DPDP Security Readiness Assessment',
  'General Security or Software Enquiry',
]);

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function hashIdentifier(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 24);
}

async function checkRateLimit(clientKey: string): Promise<{ allowed: boolean; retryAfter: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const key = `ratelimit:contact:${clientKey}`;
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, RATE_WINDOW_SECONDS, 'NX'],
          ['TTL', key],
        ]),
      });

      if (res.ok) {
        const data = (await res.json()) as Array<{ result?: number }>;
        const count = Number(data[0]?.result ?? 1);
        const ttl = Number(data[2]?.result ?? RATE_WINDOW_SECONDS);
        return {
          allowed: count <= RATE_MAX_REQUESTS,
          retryAfter: ttl > 0 ? ttl : RATE_WINDOW_SECONDS,
        };
      }
    } catch (error) {
      console.error('Upstash rate limit check failed, using local fallback', error);
    }
  }

  const now = Date.now();
  const entry = memoryRateStore.get(clientKey);
  if (!entry || entry.resetAt <= now) {
    memoryRateStore.set(clientKey, {
      count: 1,
      resetAt: now + RATE_WINDOW_SECONDS * 1000,
    });
    return { allowed: true, retryAfter: RATE_WINDOW_SECONDS };
  }

  entry.count += 1;
  if (entry.count > RATE_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfter: RATE_WINDOW_SECONDS };
}

function validatePayload(raw: unknown): { ok: true; data: ContactPayload } | { ok: false; errors: Record<string, string> } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, errors: { form: 'Invalid request payload.' } };
  }

  const record = raw as Record<string, unknown>;
  const str = (key: string, maxLen: number) =>
    typeof record[key] === 'string' ? record[key].trim().slice(0, maxLen) : '';

  const name = str('name', 120);
  const company = str('company', 160);
  const email = str('email', 160);
  const phone = str('phone', 40);
  const service = str('service', 120);
  const website = str('website', 300);
  const message = str('message', 3000);
  const consent = record.consent === true;
  const honeypot = str('company_fax', 100);
  const turnstileToken = str('cf-turnstile-response', 2048);

  const errors: Record<string, string> = {};

  if (name.length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const phoneDigits = phone.replace(/[^\d+]/g, '');
  if (phoneDigits.length < 7 || phoneDigits.length > 20) {
    errors.phone = 'Please enter a valid phone or WhatsApp number.';
  }

  if (!service || !ALLOWED_SERVICES.has(service)) {
    errors.service = 'Please select a valid service or package from the list.';
  }

  if (website.length > 0) {
    try {
      const parsed = new URL(website);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        errors.website = 'Website URL must begin with https:// or http://.';
      }
    } catch {
      errors.website = 'Please enter a valid website URL (e.g. https://example.com).';
    }
  }

  if (message.length < 10) {
    errors.message = 'Please add a short note about what you would like to test or build (at least 10 characters).';
  }

  if (!consent) {
    errors.consent = 'Please confirm that SHELLCAT may contact you about this enquiry.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      company,
      email,
      phone,
      service,
      website,
      message,
      consent,
      honeypot,
      turnstileToken,
    },
  };
}

async function verifyTurnstile(token: string, clientIp: string): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return {
      ok: false,
      error: 'Spam verification is not configured yet (missing TURNSTILE_SECRET_KEY).',
    };
  }

  if (!token) {
    return { ok: false, error: 'Please complete the human verification challenge.' };
  }

  const formBody = new URLSearchParams();
  formBody.append('secret', secret);
  formBody.append('response', token);
  if (clientIp !== 'unknown') {
    formBody.append('remoteip', clientIp);
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });
    const result = (await verifyRes.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!result.success) {
      return { ok: false, error: 'Verification failed. Please reload the check and try again.' };
    }
    return { ok: true };
  } catch (error) {
    console.error('Turnstile verification request failed', error);
    return { ok: false, error: 'Unable to verify anti-spam challenge right now.' };
  }
}

async function sendResendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string[];
    reply_to?: string;
    subject: string;
    html: string;
    text: string;
  }
): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend API rejected email request', res.status, errText.slice(0, 300));
    return false;
  }

  return true;
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return jsonResponse({ ok: false, message: 'Content-Type must be application/json.' }, 415);
  }

  const clientIp = getClientIp(request);
  const ipHash = hashIdentifier(clientIp);

  const rate = await checkRateLimit(ipHash);
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: 'Too many enquiries sent from this connection. Please wait a few minutes or chat with us on WhatsApp.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Retry-After': String(rate.retryAfter),
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  let body: unknown;
  try {
    const rawText = await request.text();
    if (rawText.length > 16_384) {
      return jsonResponse({ ok: false, message: 'Request payload is too large.' }, 413);
    }
    body = JSON.parse(rawText);
  } catch {
    return jsonResponse({ ok: false, message: 'Malformed JSON body.' }, 400);
  }

  const validated = validatePayload(body);
  if (!validated.ok) {
    return jsonResponse({ ok: false, message: 'Please review the highlighted fields.', errors: validated.errors }, 400);
  }

  const data = validated.data;

  // Honeypot trap: silently succeed to avoid teaching automated bots
  if (data.honeypot.length > 0) {
    return jsonResponse({ ok: true, message: 'Enquiry received.' }, 200);
  }

  const turnstile = await verifyTurnstile(data.turnstileToken, clientIp);
  if (!turnstile.ok) {
    return jsonResponse({ ok: false, message: turnstile.error || 'Verification failed.' }, 400);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'SHELLCAT Enquiries <onboarding@resend.dev>';

  if (!resendApiKey || !toEmail) {
    console.error('Contact email transport is not configured (missing RESEND_API_KEY or CONTACT_TO_EMAIL)');
    return jsonResponse(
      {
        ok: false,
        message:
          'Enquiry email delivery is not configured yet. Please reach us directly via WhatsApp or email while environment variables are completed.',
      },
      503
    );
  }

  const safeName = escapeHtml(data.name);
  const safeCompany = escapeHtml(data.company || 'Not provided');
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeService = escapeHtml(data.service);
  const safeWebsite = escapeHtml(data.website || 'Not provided');
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

  const adminDelivered = await sendResendEmail(resendApiKey, {
    from: fromEmail,
    to: [toEmail],
    reply_to: data.email,
    subject: `[SHELLCAT Enquiry] ${data.service} — ${data.name}`,
    text: [
      'New SHELLCAT website enquiry',
      '----------------------------',
      `Name: ${data.name}`,
      `Company: ${data.company || 'Not provided'}`,
      `Email: ${data.email}`,
      `Phone / WhatsApp: ${data.phone}`,
      `Service: ${data.service}`,
      `Website URL: ${data.website || 'Not provided'}`,
      `Consent given: Yes`,
      '',
      'Message:',
      data.message,
    ].join('\n'),
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#101208;color:#F7FFE0;padding:24px;border:1px solid #2A2F1F;">
        <h2 style="color:#C6F432;margin-top:0;">New SHELLCAT Enquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone / WhatsApp:</strong> ${safePhone}</p>
        <p><strong>Service interested in:</strong> ${safeService}</p>
        <p><strong>Website URL:</strong> ${safeWebsite}</p>
        <p><strong>Consent:</strong> Confirmed ("I agree to SHELLCAT contacting me about this enquiry")</p>
        <hr style="border-color:#2A2F1F;margin:20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="color:#C3C8B4;">${safeMessage}</p>
      </div>
    `,
  });

  if (!adminDelivered) {
    return jsonResponse(
      {
        ok: false,
        message: 'We could not deliver your enquiry right now. Please chat with us on WhatsApp or try again shortly.',
      },
      502
    );
  }

  // Send automatic confirmation reply to the enquirer
  await sendResendEmail(resendApiKey, {
    from: fromEmail,
    to: [data.email],
    subject: 'We received your enquiry — SHELLCAT',
    text: [
      `Hi ${data.name},`,
      '',
      'Thank you for contacting SHELLCAT. We have received your enquiry regarding:',
      `${data.service}`,
      '',
      'Our team in Kerala, India will review your note and get back to you shortly.',
      'Please note that no security testing is ever started without written authorisation, an agreed scope and defined rules of engagement.',
      '',
      'Regards,',
      'SHELLCAT — PENTESTING · BUG BOUNTY',
    ].join('\n'),
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#101208;color:#F7FFE0;padding:24px;border:1px solid #2A2F1F;">
        <h2 style="color:#C6F432;margin-top:0;">Enquiry received</h2>
        <p>Hi ${safeName},</p>
        <p style="color:#C3C8B4;">Thank you for contacting SHELLCAT. We have received your enquiry regarding <strong>${safeService}</strong>.</p>
        <p style="color:#C3C8B4;">Our team in Kerala, India will review your request and follow up shortly. Please remember that every security engagement requires written authorisation, an agreed scope and defined rules of engagement before testing begins.</p>
        <p style="color:#8E937F;font-size:13px;margin-top:24px;">SHELLCAT · PENTESTING · BUG BOUNTY · Kerala, India</p>
      </div>
    `,
  });

  return jsonResponse(
    {
      ok: true,
      message: 'Thank you. Your enquiry has been sent and a confirmation email is on its way.',
    },
    200
  );
}

export async function GET(): Promise<Response> {
  return jsonResponse({ ok: false, message: 'Method not allowed.' }, 405);
}
