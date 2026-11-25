# ShellCat Brand Kit

**Logo:** Cat C Monogram, a letter C with cat ears and a terminal cursor in its mouth.
Approved 25 Nov 2026.

---

## 1. Which logo file do I use?

| What you're making | Use this file (in `logo/svg/` or `logo/png/`) |
|---|---|
| Website header, slides, documents on a **dark** background | `shellcat-horizontal-on-dark` |
| The same on a **light** background | `shellcat-horizontal-on-light` |
| Square or tall spaces (posters, splash screens, merch) | `shellcat-stacked-on-dark` / `-on-light` |
| Small spaces: avatars, app icons, stickers | `shellcat-icon-on-dark` / `-on-light` |
| The name on its own | `shellcat-wordmark-on-dark` / `-on-light` |
| Printing in **one colour** (stamps, engraving, single-colour merch) | the `-white` or `-black` versions |

**SVG or PNG?**
- **SVG** stays sharp at any size. Use it for websites, Figma and printing.
- **PNG** is for apps that don't accept SVG (some Word/PowerPoint versions, social media uploads).
  Each PNG comes in two sizes and has a transparent background.

## 2. Social media

All files are in `social/`.

| Platform | File | Where to upload |
|---|---|---|
| YouTube, Instagram, GitHub, LinkedIn, X | `profile-picture-1080.png` | Profile / organisation picture. Every platform crops it to a circle; the logo stays inside. |
| Same platforms (alternative) | `profile-picture-lime-1080.png` | A brighter option. Use one version everywhere so people recognise you. |
| YouTube | `youtube-banner-2560x1440.png` | YouTube Studio → Customisation → Branding → Banner image. The logo sits in the area every device shows. |
| LinkedIn company page | `linkedin-cover-1128x191.png` | In your page's admin view, choose **Edit page** and upload it as the cover image. |
| GitHub repositories | `github-social-preview-1280x640.png` | Repository → Settings → General → Social preview. |

## 3. Website icons (favicon)

All files are in `icons/`.

1. Copy `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png` and `icon-512.png`
   into your website's public/root folder (the folder that holds `index.html`).
2. Paste these lines inside `<head>` on every page:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

3. If the site is a web app with a `manifest.json`, list `icon-192.png` and `icon-512.png` there.
4. To check it worked, open the site and look at the browser tab. If you still see the old icon,
   do a hard refresh (Ctrl + F5).

`app-icon-1024.png` is a rounded-square app icon for presentations, app stores or a desktop shortcut.

## 4. Colours

| Name | HEX | RGB | Use it for |
|---|---|---|---|
| **Night** | `#101208` | 16, 18, 8 | Main background; the logo on light backgrounds |
| **Lime** | `#C6F432` | 198, 244, 50 | The logo on dark backgrounds; highlights and buttons on dark |
| **Mist** | `#F7FFE0` | 247, 255, 224 | "Shell" and body text on dark backgrounds |
| **Olive** | `#5C7A00` | 92, 122, 0 | "Cat" and the cursor on light backgrounds; links on light |
| **White** | `#FFFFFF` | 255, 255, 255 | The cursor on dark backgrounds |

Contrast (WCAG): Lime on Night 14.7 : 1 · Mist on Night 18.3 : 1 · Olive on White 5.0 : 1 (passes AA for text).
**Never put Lime on white or light backgrounds.** At 1.3 : 1 it's almost unreadable; use Olive there instead.

## 5. Fonts

| Role | Font | Where to get it |
|---|---|---|
| Logo and headings | **Bricolage Grotesque ExtraBold** | Included in `fonts/`. Free, SIL Open Font Licence. |
| Body text and UI | **Inter** | Free: https://fonts.google.com/specimen/Inter |

To install on Windows: right-click `BricolageGrotesque-96pt-ExtraBold.ttf` → **Install**.
In font menus it appears as **Bricolage Grotesque 96pt ExtraBold**.
The included file covers English and Western European languages, in the ExtraBold weight only.
For other weights (for lighter headings) or other languages, download the full family free:
https://fonts.google.com/specimen/Bricolage+Grotesque

**Never retype the logo.** The word "ShellCat" in the logo files has custom spacing and is
converted to shapes; always use the files.

## 6. Clear space and minimum size

- **Clear space:** leave empty space on every side of the logo at least as big as the
  cursor block's height (about one fifth of the cat's height).
- **Minimum size:** horizontal logo 120 px wide on screens / 25 mm in print.
  Icon alone: 16 px on screens / 8 mm in print.

## 7. Don't

- Stretch, squash or rotate the logo
- Change its colours outside the palette above
- Add shadows, glows or outlines
- Move the cat and the name apart, or rearrange them
- Put the Lime logo on a light background
- Retype "ShellCat" in another font

## 8. What changed from the canvas version

The design is the one approved on the canvas (board 9, "Cat C Monogram"). For the final files:

- The ears and the C are merged into one clean outline, so the logo cuts, prints and
  embroiders cleanly. Nothing changed visually.
- The wordmark is set with the font's real letter pairs (kerning) and converted to shapes.
- The space between the cat and the name is tighter. The canvas box had padding built in,
  which made them look separate.
- On light backgrounds the cursor is **Olive** instead of the lighter green `#8DB800`,
  which was hard to see (2.1 : 1).

## 9. Licence

Bricolage Grotesque © 2022 The Bricolage Grotesque Project Authors, licensed under the
SIL Open Font License 1.1 (see `fonts/OFL.txt`). The font is free for commercial use.
