# SHELLCAT Website — Verification & Test Report

All checks below were executed against the compiled production build (`dist/`) and `api/contact.ts` on Node.js v24.15.0 and headless Google Chrome.

---

## 1. Type-Checking & Build Verification
- **`npm run build` (`astro check && astro build`):** Passed (`0 errors, 0 warnings, 0 hints` across 24 files; 12 static pages built in `1.27s`, plus `sitemap-index.xml`).
- **`npx tsc --noEmit`:** Passed with exit code `0`.

---

## 2. Lighthouse Scores (`http://127.0.0.1:4399/`)
Ran via `lighthouse` CLI against the local static production server with `vercel.json` headers applied:

| Preset | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **Desktop** | **100** | **100** | **100** | **100** | `0.3 s` | `0.3 s` | `0.028` | `0 ms` |
| **Mobile** | **100** | **100** | **100** | **100** | `1.4 s` | `1.4 s` | `0.004` | `0 ms` |

---

## 3. Accessibility & Brand Contrast Verification
- **WCAG 2.2 AA Contrast Ratios (verified on Night `#101208` and Surface `#161910`):**
  - Mist `#F7FFE0` on Night `#101208`: **18.29:1** (`17.22:1` on Surface `#161910`)
  - Secondary `#C3C8B4` on Night `#101208`: **11.01:1** (`10.37:1` on Surface `#161910`)
  - Muted `#8E937F` on Night `#101208`: **5.96:1** (`5.62:1` on Surface `#161910`)
  - Lime `#C6F432` on Night `#101208`: **14.74:1** (`13.88:1` on Surface `#161910`)
  - Primary button text Night `#101208` on Lime `#C6F432`: **14.74:1**
- **Keyboard, Landmarks & Reduced Motion:**
  - Verified skip-to-content link, visible `:focus-visible` outlines, single `<h1>` per page across all 12 routes, native `<details>`/`<summary>` FAQ accordions, and `prefers-reduced-motion: reduce` support (`global.css` + `public/scripts/terminal.js`).
  - Verified mobile navigation toggle (`aria-expanded`, `hidden` state, and `Escape` key closing) in headless Chrome.

---

## 4. Security Header, CSP & API Verification
- **HTML CSP Audit:** All 12 built HTML files in `dist/` contain `0` inline executable `<script>` tags, `0` inline `<style>` blocks, and `0` `style="..."` attributes (`inlineStylesheets: 'never'`, external `/scripts/*.js` modules, self-hosted fonts).
- **HTTP Headers (`vercel.json`):**
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self'; font-src 'self'; img-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Resource-Policy: same-origin`
  - **Note:** Because this was tested locally before deploying to a live HTTPS domain, `securityheaders.com` itself was not queried externally; `vercel.json` sets all headers required for an **A/A+** grade once deployed on Vercel HTTPS.
- **`/.well-known/security.txt` & `robots.txt`:** Both returned HTTP `200` with `Content-Type: text/plain; charset=utf-8` locally.
- **`api/contact.ts` Integration Checks (in-process Node.js tests):**
  - `GET /api/contact` -> `405`
  - Non-JSON `POST` -> `415`
  - Invalid fields (`name`, `email`, `phone`, `service`, `website`, `message`, `consent`) -> `400` with field errors
  - Honeypot (`company_fax` populated) -> `200` silent trap
  - Missing `TURNSTILE_SECRET_KEY` -> `400` clean failure
  - 6th request from same IP within 10 minutes -> `429` rate limit triggered
  - *(Note: live Cloudflare Turnstile verification and Resend email dispatch require configuring real keys in `.env` / Vercel Environment Variables.)*

---

## 5. Mobile & Cross-Page Chrome Verification (`360x800` & `1440x900`)
Tested all 12 routes in headless Google Chrome at `360x800` mobile (and `/`, `/pricing`, `/services` at `1440x900` desktop) with `vercel.json` CSP enforced:
- `/`, `/services`, `/development`, `/pricing`, `/how-we-work`, `/about`, `/dpdp-readiness`, `/contact?service=SHELLCAT+WEB+VAPT`, `/legal/privacy-policy`, `/legal/terms-of-service`, `/legal/responsible-disclosure`, and `/nonexistent-page` (custom 404).
- **Result across all 12 routes:** `overflow=0px`, `h1=1`, all `<img>` assets loaded (`OK`), `0` console/CSP errors, and `?service=SHELLCAT+WEB+VAPT` pre-selected `SHELLCAT WEB VAPT (Starting at ₹25,000)` on `/contact`.
