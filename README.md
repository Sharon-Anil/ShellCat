# SHELLCAT Website

Official marketing and enquiry website for **SHELLCAT** (`ShellCat`), Kerala, India — built with **Astro**, **Tailwind CSS v4**, self-hosted fonts (`Bricolage Grotesque`, `Inter`, `JetBrains Mono`), and a **Vercel Serverless Function** for contact enquiries.

---

## Quick Start (Windows PowerShell)

### 1. Prerequisites
- **Node.js 24 LTS** (or Node.js 22+) and **npm**
- Git (optional, for deploying via GitHub/GitLab to Vercel)
- A **Vercel** account (Hobby or Pro)
- A **Cloudflare Turnstile** site key & secret key (free) for contact form spam protection
- A **Resend** API key (or another transactional email provider) to deliver contact enquiries and auto-confirmation replies

### 2. Install Dependencies
Open Windows PowerShell in the project folder and run:

```powershell
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` for local testing:

```powershell
Copy-Item .env.example .env
```

Fill in the values inside `.env`:
- `PUBLIC_SITE_URL` — Your live website URL (for example `https://shellcat.in`), used for `sitemap-index.xml`, canonical tags, and Open Graph tags.
- `PUBLIC_TURNSTILE_SITE_KEY` — Your Cloudflare Turnstile public site key.
- `TURNSTILE_SECRET_KEY` — Your Cloudflare Turnstile secret key (server-side only).
- `RESEND_API_KEY` — Your Resend API key for sending enquiries and automatic replies.
- `CONTACT_FROM_EMAIL` — Verified sender address in Resend (for example `SHELLCAT Enquiries <enquiries@yourdomain.com>`).
- `CONTACT_TO_EMAIL` — Your official SHELLCAT inbox address (`[INSERT OFFICIAL BUSINESS EMAIL]`).
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` *(optional)* — Recommended for distributed rate limiting across Vercel serverless instances.

### 4. Run Locally
```powershell
npm run dev
```
Open the local URL shown in the terminal (by default `http://localhost:4321`).

> **Note on `/api/contact` locally:** Astro's static dev server (`npm run dev`) serves pages and static assets. To test the `/api/contact` Vercel Serverless Function locally as well, install the Vercel CLI and run `vercel dev`:
> ```powershell
> npm install -g vercel
> vercel dev
> ```

### 5. Type-Check and Build for Production
```powershell
npm run build
```
This runs `astro check` followed by `astro build`, outputting the static site to `dist/`.

---

## Deploying to Vercel

### Option A: Deploy via Git (Recommended)
1. Push this folder to a private GitHub, GitLab, or Bitbucket repository.
2. In the **Vercel Dashboard**, click **Add New → Project** and import the repository.
3. Vercel automatically detects **Astro** (`astro build` -> `dist/`) and picks up `api/contact.ts` and `vercel.json`.
4. Under **Project Settings → Environment Variables**, add:
   - `PUBLIC_SITE_URL`
   - `PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
   - *(Optional)* `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `PUBLIC_PLAUSIBLE_DOMAIN`
5. Trigger a deployment and connect your custom domain under **Settings → Domains**.

### Option B: Deploy from Windows CLI
```powershell
vercel login
vercel link
vercel env add PUBLIC_SITE_URL
vercel env add PUBLIC_TURNSTILE_SITE_KEY
vercel env add TURNSTILE_SECRET_KEY
vercel env add RESEND_API_KEY
vercel env add CONTACT_FROM_EMAIL
vercel env add CONTACT_TO_EMAIL
vercel --prod
```

---

## Project Structure

```text
api/
  contact.ts                  # Vercel Serverless Function (validation, honeypot, Turnstile, rate limit, Resend email + auto-reply)
public/
  .well-known/security.txt    # RFC 9116 vulnerability reporting contact
  downloads/SHELLCAT-Brochure.pdf
  fonts/BricolageGrotesque-96pt-ExtraBold.ttf
  logos/shellcat-horizontal-on-dark.svg
  logos/shellcat-icon-on-dark.svg
  favicon.ico, favicon.svg, apple-touch-icon.png, icon-192.png, icon-512.png
  og-preview.png              # Social Open Graph preview (1280x640)
  manifest.webmanifest
  robots.txt
src/
  components/                 # Header, Footer, TerminalHero, HeroRings, Icon, PricingCard, FinalCtaBand, FloatingWhatsApp
  data/                       # Editable JSON content files (site, services, pricing, faq, about, how-we-work)
  layouts/BaseLayout.astro    # Shared HTML head, SEO meta, JSON-LD schema, self-hosted CSS/fonts
  pages/                      # Home, Services, Development, Pricing, How We Work, About, DPDP Readiness, Contact, Legal, 404
  styles/global.css           # Tailwind v4 tokens & self-hosted Fontsource imports
astro.config.mjs              # Static output, Tailwind v4 plugin, @astrojs/sitemap, external CSS bundles for strict CSP
vercel.json                   # Clean URLs, immutable asset caching, strict security headers (A/A+ target)
```

---

## Security Architecture Notes
- **Strict Content-Security-Policy (`vercel.json`):** No `'unsafe-inline'` scripts or styles. Stylesheets are emitted externally (`build.inlineStylesheets: 'never'`), fonts are self-hosted (`font-src 'self'`), and `frame-ancestors 'none'` prevents clickjacking.
- **Turnstile + Honeypot + Rate Limiting (`api/contact.ts`):** Every form submission checks field types and lengths, traps automated bots via a hidden honeypot field, verifies the Cloudflare Turnstile token server-side, enforces rate limits (`5` requests per `10` minutes per IP hash), and escapes all HTML before emailing.
- **Privacy (DPDP-ready defaults):** Zero advertising cookies or third-party tracking scripts load by default. If you configure `PUBLIC_PLAUSIBLE_DOMAIN`, update `vercel.json`'s `Content-Security-Policy` (`script-src` and `connect-src`) to allow `https://plausible.io`.
- **Update domain references before launch:** Replace `https://shellcat.example` in `public/robots.txt`, `public/.well-known/security.txt`, and `PUBLIC_SITE_URL` with your official live domain.
