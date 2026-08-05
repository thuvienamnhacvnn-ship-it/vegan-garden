# Vegan Garden Berlin

Bilingual (DE / VI) website for **Vegan Garden**, a 100 % plant-based Vietnamese
restaurant at Frankfurter Allee 21, 10247 Berlin-Friedrichshain.

Built directly from the design mock-ups in `E:\Works\PTC\Vegan` (`v1`–`v5.png`)
and the supplied brand logo (`vegan logo.svg`).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3020
```

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server on port **3020**                     |
| `npm run build`     | Production build                                |
| `npm run start`     | Serve the production build on port 3020         |
| `npm run typecheck` | `tsc --noEmit`                                  |
| `npm run lint`      | ESLint (next/core-web-vitals + next/typescript)  |

Copy `.env.example` to `.env.local` before deploying — see **Environment** below.

---

## Tech stack

### Visual direction

Bright, high-contrast "restaurant editorial" on a **forest green brand band** —
the colour of the mock-ups. The home page alternates: green (hero), cream
(story), green (commitment), cream (dishes, gallery, bento), green (quote), so
the palette itself marks the rhythm. Two rules the codebase enforces everywhere:

1. **No blur.** There is no `backdrop-blur` anywhere; panels are solid.
2. **No dimming overlays on photography.** Images run at full brightness, and
   type sits on its own solid panel beside or below them instead of on top.
   The hero is a split for exactly this reason — the headline gets a green
   panel rather than a scrim over the food.

`scripts/strip-overlays.mjs` re-applies rule 2 if an overlay creeps back in. It
deletes self-closing tint layers outright and *reports* the ones that wrap
content, since removing those would take the caption with them.

Palette tokens live at the top of `src/app/globals.css`, in two groups:

- **Semantic, theme-flipping** — `surface` / `card` / `ink` / `line` /
  `inverse`. Defined twice, once per theme, with the same meaning; `inverse` is
  "the opposite-brightness anchor", so it is dark in day and light in night.
- **Brand band, constant** — `band` / `on-band` / `gold-band` / `line-band`.
  The forest green is *identity, not contrast*, so these hold the same value in
  both themes. Use them (and the `onBand` button variant) for anything on the
  green; using `inverse` there would invert the band in the night theme.

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** — design tokens live in `src/app/globals.css`
- **Framer Motion** — scroll reveals, page transitions, menu/cart panels
- **Swiper 14** — hero slider and the review carousel
- **React Hook Form + Zod 4** — reservation, checkout and newsletter forms
- **Lucide** for UI glyphs; the botanical/gold icon set is hand-drawn SVG in
  `src/components/ui/Icons.tsx`

> This project lives inside the home directory, which is itself a git repo.
> `globals.css` therefore uses `@import "tailwindcss" source("../")` so Tailwind
> only scans `src/` instead of the whole home folder.

---

## Project structure

```
src/
  app/
    (site)/             the public site — wrapped in SiteChrome by its layout
      page.tsx          home: hero → marquee → story → commitment → dishes
                        → gallery strip → bento → quote band
      menu/ gallery/ our-story/ reservation/ order/ contact/ …
    admin/              the owner's inbox — deliberately OUTSIDE (site), so it
                        renders on the bare root layout with no guest chrome
    api/                reservation · order · newsletter · admin route handlers
    sitemap.ts robots.ts
  components/
    layout/             SiteChrome (header/footer/cart/smooth scroll/intro/
                        cursor), Header, MobileMenu, Footer, Providers,
                        PageTransition, SmoothScroll, LoadingScreen,
                        CustomCursor, LanguageSwitcher, Theme*
    sections/           HeroBig, ValueMarquee, StoryTeaser, CommitmentBand,
                        PinnedDishes, GalleryStrip, QuoteBand, ReservationCta,
                        ContactSection, ValueStrip, PageHero, LegalPageView
    bento/              BentoBlock + Tile — the actionable grid on the home page
    menu/               MenuSplit + DishDrawer (menu page),
                        MenuBrowser + DishCard + DishModal (order page)
    gallery/            GalleryGrid, Lightbox
    cart/               CartProvider, CartDrawer, CartButton
    forms/              Field primitives, ReservationForm, NewsletterForm
    motion/             Scroll — shared scroll-linked primitives
    ui/                 Logo, Button, Reveal, Icons, SectionHeading, …
  data/                 ← all editable content lives here
  messages/             de.json · vi.json — every UI string
  i18n/                 LocaleProvider (context + localStorage)
  lib/                  fonts, format, hours, validation, seo, store,
                        smoothScroll, whatsapp, adminAuth
  hooks/                useScrollLock, useMagnetic
  types/

public/
  images/               photography cropped out of the mock-ups
  video/                hero.mp4 + poster (built by make-hero-video.ps1)
  qr/                   menu · order · reservation QR codes (make-qr.mjs)
  logo/                 vegan-garden-logo.svg (full lockup)
                        vegan-garden-mark.svg (lotus only)
scripts/
  extract-images.ps1    re-renders the photos out of the mock-ups (ffmpeg)
  make-hero-video.ps1   builds the cinematic hero loop from those photos
  make-qr.mjs           regenerates the QR codes in public/qr
  sync-image-dims.mjs   writes the real image sizes back into data/gallery.ts
  strip-overlays.mjs    removes any dimming layer added on top of a photo,
                        and reports the ones that wrap content (fix by hand)
  logo-bbox.mjs         computes the lotus bounding box for the mark
  retoken.mjs           remaps colour tokens when the palette changes
  fix-encoding.mjs      repairs UTF-8 mangled by a Windows-1252 round-trip
```

Requires **ffmpeg** on PATH for the two image/video scripts.

---

## Editing content

Nothing user-facing is hard-coded in a component.

| What                                          | File                              |
| --------------------------------------------- | --------------------------------- |
| Address, phone, e-mail, opening hours, socials | `src/data/site.ts`                |
| Dishes, prices, categories, tags, allergens    | `src/data/menu.ts`                |
| Gallery images + captions                      | `src/data/gallery.ts`             |
| Guest reviews                                   | `src/data/reviews.ts`             |
| Hero slider images                              | `src/data/hero.ts`                |
| Brand values / "why us" items                   | `src/data/values.ts`              |
| Impressum, Datenschutz, AGB                     | `src/data/legal.ts`               |
| Every other string (nav, buttons, errors, SEO)  | `src/messages/de.json` + `vi.json`|

### Adding a dish

Append an entry to `dishes` in `src/data/menu.ts`. It automatically appears on
the menu page, in the online-order flow, in search, in the filters and in the
`schema.org` menu markup. `signatureDishIds` in the same file controls which
four dishes the home page features.

### Bilingual fields

Data files use `{ de: "…", vi: "…" }`. Components read them through
`pick()` from `useLocale()`. UI strings use `t('some.key')`, which resolves
against `messages/<locale>.json`.

`de.json` is the reference shape — a key missing from `vi.json` is a TypeScript
error, not a blank string on the page.

---

## Replacing images

The photography was cropped out of the design mock-ups. To regenerate it:

```powershell
powershell -File scripts/extract-images.ps1
```

Each entry in that script is `source, x, y, width, height, scale, output`, in
mock-up pixel coordinates (the mock-ups are 1672 × 941). Crops deliberately
avoid the baked-in mock-up typography.

Every export is at least **2200 px on the long edge**, rendered with Lanczos
resampling plus an unsharp and contrast pass so the food reads crisp and bright.
After re-rendering, run `node scripts/sync-image-dims.mjs` to write the new
intrinsic sizes back into `src/data/gallery.ts`.

### Hero video

`powershell -File scripts/make-hero-video.ps1` builds `public/video/hero.mp4`
(~2 MB, 24 s, 1600×900) as a slow Ken Burns push cross-fading across four
frames, plus a poster still. Drop real footage at the same paths to replace it —
`HeroCinema` keeps a full-resolution photo underneath, so the hero never shows
an empty frame if the video is missing or autoplay is blocked.

To use real photography instead, drop files into `public/images/…` and update
the `src`, `width` and `height` fields in `src/data/gallery.ts`,
`src/data/hero.ts` and the `image` field of each dish. Intrinsic sizes are
stored alongside every image so `next/image` reserves the box up front and the
layout never shifts.

**The logo is used as supplied** — only scaled, never recoloured or distorted.
`vegan-garden-mark.svg` is the same file with a `viewBox` cropped to the lotus,
computed by `scripts/logo-bbox.mjs`; no path data was touched.

---

## Language handling

- German is the default and the server-rendered language.
- The header `VI / DE` toggle switches instantly — navigation, headings, forms,
  validation messages, toasts and the footer all follow.
- The choice is stored in `localStorage` under `vegan-garden.locale`.
- On a first visit with no stored choice, a Vietnamese browser locale is
  honoured; everyone else gets German.

---

## Forms and demo data

`POST /api/reservation`, `/api/order` and `/api/newsletter` validate with the
same Zod schemas the client uses, so opening hours, the booking window, guest
limits and the delivery minimum cannot be bypassed by posting directly. Order
totals are recalculated from `menu.ts` on the server; the client's numbers are
never trusted.

Submissions are written to `data-store/*.json` (git-ignored). Set
`RESERVATION_STORAGE=console` to log them instead. `src/lib/store.ts` is the
single seam to replace with a database or a booking provider.

The cart lives in `localStorage` under `vegan-garden.cart`. Checkout is a
working demo: it produces an order code and a simulated status timeline.
**No payment is processed** — `src/app/api/order/route.ts` carries a `payment`
field and the checkout UI has the placeholder block where Stripe or PayPal
would go.

---

## Owner notifications (WhatsApp)

Every reservation and every order notifies the owner. `src/lib/whatsapp.ts`
composes a German message and sends it two ways:

- **Connected** — set `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TOKEN` and
  `WHATSAPP_OWNER_NUMBER` and the message goes out through the WhatsApp Cloud
  API (Meta) as soon as the booking lands.
- **Not connected** — the same message becomes a ready-to-send `wa.me` link,
  logged to the server and shown in the admin inbox as *"In WhatsApp öffnen"*.
  Nothing is lost; the owner just taps to send.

The delivery result (channel, success, error, link) is stored on the record, so
the admin can always see whether an alert actually went out.

> Meta only delivers free-form text inside the 24-hour service window. For a
> production setup either reply once from the business number to open the
> window, or register a message template with Meta.

## Admin area

`/admin` is the owner's inbox: reservations and orders newest-first, with the
full detail of each (guests, allergies, order lines, delivery address, notes),
the WhatsApp delivery status, and a status control
(*Neu → Bestätigt → Am Tisch* / *Neu → In der Küche → Fertig → Abgeschlossen*).

Set `ADMIN_PASSWORD` in `.env.local` to switch it on — while it is empty the
route renders a "not enabled" notice and the API refuses to issue a session.

**What this auth is:** one shared password exchanged for an HMAC-signed,
httpOnly cookie (12 h). It suits a single operator checking their own inbox.
**What it is not:** multi-user auth. There are no accounts, roles, rate
limiting or audit trail. Serve the site over HTTPS and use a long password.

## Environment

| Variable                   | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | Canonical URLs, sitemap, Open Graph images            |
| `RESERVATION_STORAGE`       | `file` (default) or `console`                         |
| `RESERVATION_NOTIFY_EMAIL`  | Where mail *would* go (no mail is sent yet)           |
| `WHATSAPP_OWNER_NUMBER`     | Owner's number, international format, digits only     |
| `WHATSAPP_PHONE_NUMBER_ID`  | Meta sender id — enables real sending                 |
| `WHATSAPP_TOKEN`            | Meta permanent access token                           |
| `ADMIN_PASSWORD`            | Enables `/admin`; empty disables it                   |
| `ADMIN_SECRET`              | Optional extra salt for the session cookie            |

SMTP and payment keys are listed in `.env.example`, commented out and unused.

---

## SEO

Per-page bilingual metadata, Open Graph + Twitter cards, canonical and
`hreflang` alternates, `sitemap.xml`, `robots.txt`, and a `schema.org`
`Restaurant` graph (address, geo, opening hours, aggregate rating and the full
menu) injected from `src/lib/seo.ts`.

---

## Accessibility

Skip link; full keyboard navigation; visible gold focus rings; focus traps in
the mobile menu, cart drawer, dish modal and lightbox; `aria-label`s on every
icon button; a pause control on the hero slider; 44 px minimum touch targets;
and `prefers-reduced-motion` disables autoplay, Ken Burns, parallax, the
custom cursor and the intro screen.

---

## Deploying to Vercel

`next build` passes as-is and there is no edge-runtime or case-sensitivity
trap, so the build itself is clean on Linux. Two things do **not** carry over
automatically:

**1. Set the environment variables.** `.env.local` is git-ignored, so nothing
reaches Vercel on its own. `NEXT_PUBLIC_SITE_URL` matters most — it falls back
to `http://localhost:3020`, and that fallback ends up inside `sitemap.xml`,
`robots.txt`, every canonical link and every Open Graph image URL. Set it, plus
`ADMIN_PASSWORD` (empty disables `/admin` entirely) and the WhatsApp trio if
owner alerts should go out.

**2. `data-store/` does not persist.** Serverless filesystems are read-only and
thrown away between invocations. `appendRecord` catches the write failure and
logs the record instead of failing the guest's request, so bookings still
*appear* to work — but nothing is stored and the `/admin` inbox stays empty.
Before taking real bookings, replace the two functions in `src/lib/store.ts`
with a database (that file is the only seam), or set
`RESERVATION_STORAGE=console` to make the behaviour explicit.

## Before going live

The address is confirmed from the mock-up. **The phone number, e-mail address,
website and opening hours are placeholders taken from the design** — verify
them and update `src/data/site.ts`.

`src/data/legal.ts` marks every field the operator must complete with
`[PLATZHALTER]` / `[CHỖ TRỐNG]`: company name, register court and number, VAT
ID, and the person responsible for content. Have the Impressum, Datenschutz
and AGB reviewed by a lawyer before launch.
