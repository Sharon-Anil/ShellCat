# Placeholders & Content Editing Guide

This document lists **every `[PLACEHOLDER]` remaining in the site** and shows **the exact files to edit** to update prices, services, FAQ, and company details.

---

## 1. Where to Edit Prices, Services, FAQ & Core Copy

| What you want to edit | File to edit | Notes |
|---|---|---|
| **Prices & package features** (Security Packages, Website Packages, Monthly Protection) | `src/data/pricing.json` | Update prices in Indian format (e.g. `₹1,00,000`) and edit `monthlyNotes` for GST status. |
| **10 Cybersecurity Services** | `src/data/cybersecurity-services.json` | Edit `shortLine`, `whatItIs`, `whoItIsFor`, and `whatYouReceive`. |
| **4 Software & Web Development offerings** | `src/data/development-services.json` | Edit descriptions, highlights, and starting package tags. |
| **FAQ (9 questions & answers)** | `src/data/faq.json` | Edit question titles and answers; fill `[DURATION]` and `[NDA DETAILS]`. |
| **Who We Are, Mission, Vision, Values, Stats, Differentiators** | `src/data/about.json` | Contains brochure copy and cited India statistics + source line. |
| **5-Step Process & Before-We-Test Checklist** | `src/data/how-we-work.json` | Edit the 5 stages, assurance statement, and 5 checklist items. |
| **Contact details, WhatsApp URL, Founder & Legal placeholders** | `src/data/site.json` | Central config for header, footer, contact sidebar, founder bio, and WhatsApp CTA. |
| **Contact dropdown options & email handler** | `src/pages/contact.astro` & `api/contact.ts` | Keep `ALLOWED_SERVICES` in `api/contact.ts` in sync if you rename any service or package in `contact.astro`. |

---

## 2. Complete Checklist of `[PLACEHOLDER]` Items Still to Fill

### A. Business & Contact Details (`src/data/site.json`)
1. `[NUMBER]` — Official WhatsApp number in international format without `+` or spaces (e.g. `9198XXXXXXXX`), inside both `whatsappNumber` and `whatsappUrl` (`https://wa.me/9198XXXXXXXX?text=Hi%20SHELLCAT%2C%20I%27d%20like%20a%20Web%20Check`).
2. `[INSERT OFFICIAL BUSINESS EMAIL]` — Official business email address (appears in `site.json`, Footer, Contact page, Legal pages, and `public/.well-known/security.txt`).
3. `[INSERT BUSINESS PHONE]` — Official business phone number.
4. `[INSERT OFFICIAL WEBSITE]` — Official domain name (also update `PUBLIC_SITE_URL` in `.env` / Vercel, `public/robots.txt`, and `public/.well-known/security.txt` where `https://shellcat.example` is currently used as a valid build fallback).
5. `[INSERT OFFICIAL SOCIAL LINKS]` — Official social media profile URLs (`socialLinks` & `socialLinksPlaceholder` in `src/data/site.json`, used in Footer and Contact page).
6. `[BOOKING LINK]` — Calendar/booking URL (e.g. Cal.com or Calendly link) shown on the Contact page.
7. `[e.g. within 1 business day]` — Confirmed enquiry response time on the Contact page (`responseTime`).

### B. Pricing & Tax (`src/data/pricing.json` & `src/data/site.json`)
8. `[GST: confirm whether prices include or exclude GST]` — Replace with e.g. `"Prices exclude 18% GST."` or `"All listed prices are inclusive of GST."` in `src/data/pricing.json` (`monthlyNotes`) and `src/data/site.json` (`gstNote`).

### C. Founder Section (`src/data/site.json` & `src/pages/about.astro`)
9. `[FOUNDER NAME]` — Founder's full name (`founder.name`).
10. `[FOUNDER PHOTO]` — Replace the placeholder box in `src/pages/about.astro` with a real optimized photo in `public/images/founder.webp` (or `.avif`).
11. `[FOUNDER SHORT BIO]` — Founder's verified short biography (`founder.bio`).

### D. FAQ Placeholders (`src/data/faq.json`)
12. `[DURATION]` — Typical turnaround time for a **SHELLCAT WEB CHECK** (FAQ #4).
13. `[NDA DETAILS]` — Standard confidentiality / NDA policy details (FAQ #8).

### E. Legal & Security Policy Placeholders
14. `[INSERT EFFECTIVE DATE]` — Effective date in `src/pages/legal/privacy-policy.astro` and `src/pages/legal/terms-of-service.astro`.
15. `[CONFIRM ANALYTICS STATUS]` — Confirm whether Plausible/Umami cookie-free analytics is enabled or `"No analytics scripts are currently loaded"` in `src/pages/legal/privacy-policy.astro`.
16. `[INSERT DATA RETENTION PERIOD — e.g. 12 months]` — In `src/data/site.json` (`legal.dataRetention`), used in Privacy Policy.
17. `[INSERT GOVERNING LAW / JURISDICTION — e.g. Kerala, India]` — In `src/data/site.json` (`legal.jurisdiction`), used in Terms of Service.
18. `[OPTIONAL PGP FINGERPRINT]` & `[OPTIONAL PGP KEY URL PLACEHOLDER]` — In `src/data/site.json` (`legal.pgpKey`) and `public/.well-known/security.txt`.

### F. Environment Variables & Anti-Spam (`.env` / Vercel Dashboard)
19. `[INSERT CLOUDFLARE TURNSTILE SITE KEY]` — Set `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel Environment Variables (Contact page automatically mounts the Turnstile widget once `PUBLIC_TURNSTILE_SITE_KEY` is non-empty).
20. `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` — Required in Vercel Environment Variables so `/api/contact` emails enquiries and automatic confirmation replies.
21. `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` *(optional)* — Recommended in Vercel Environment Variables for persistent cross-instance rate limiting.
