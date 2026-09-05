# Ghoroa — Project Memory

**Last updated:** 2026-09-04  
**This is the handoff doc for continuing work after the folder rename.**  
**Do not invent a new brand.** This is the source of truth for decisions already locked with the client.

---

## Client & agency

| | |
|---|---|
| Client | Ghoroa Restaurant (Tamjid Hossain) |
| Agency | Pixel Mango (Izaz Zubayer) |
| Repo path | `/Users/izazzubayer/Documents/Ghoroa` |
| GitHub | `https://github.com/Izazzubayer/Ghoroa.git` |
| Phase | 1 — headless Next.js frontend + WordPress CMS |

---

## Architecture (locked — headless)

| Path | Role |
|---|---|
| `ghoroa-web/` | **Production frontend** — Next.js App Router (Vercel) |
| `ghoroa-core/` | CMS — public REST under `/ghoroa/v1` |
| `ghoroa-theme/` | Block theme — **non-production fallback only** |

- WP publish events trigger signed tag revalidation at `/api/revalidate`.
- Draft preview via secret + WordPress capability.
- Locale routes: `/en` and `/bn`. Root `/` redirects to `/en`.
- Order Now is CMS setting: WhatsApp Phase 1, Rosuii Phase 2.
- Contact/reservation is form on `/contact/` (no online ordering).

See `docs/headless-architecture.md` and `ghoroa-web/README.md`.

---

## Scope (hard)

- Marketing website only: brand, menus, bilingual content, SEO.
- **No cart, checkout, kitchen dashboard, or custom WooCommerce** in production.
- Operations (ordering/POS) = **Rosuii SaaS** later, not built here.

---

## Site hierarchy (locked — reconciled to the signed agreement, Sep 2026)

An earlier version of this file listed "Online Order" and "Reservations" as nav
items. **That contradicted the signed agreement**, which specifies eight pages and
states "No online ordering". The agreement wins. Resolved with Izaz on 2026-09-04.

**Primary nav:**

1. Home — `/`
2. Menu — `/menu/` (Breakfast · Lunch · Dinner · Juice · Snacks)
3. About — `/about/`
4. Locations — `/locations/`
5. Contact — `/contact/` (contact form doubles as the reservation enquiry form)

**Header button:** *Order Now* — WhatsApp/phone in Phase 1, repointed to the Rosuii
URL in Phase 2. One link change, no rebuild.

**Footer:** FAQ · Privacy · Terms + hours/phone/WhatsApp/socials.

**Reservations is not a page.** It is the enquiry form on `/contact/` plus a call
CTA. This satisfies the "call + form" intent without adding scope.

Eight separate URLs are required for the contracted local SEO: each needs its own
title, meta description and `hreflang` EN/BN. A single page cannot carry that.

---

## Design system (locked — from Ghoroa_Brand_Guidelines.html, Sep 2026)

`Ghoroa_Brand_Guidelines.html` is the **only** brand source, per the development
sequence ("Source for theme.json tokens"). Earlier entries in this file citing
Newsreader/DM Sans and red `#E6302E`, and the forest-green + gold palette built from
`Website Sample.png`, are both **superseded**.

**Tokens live in `ghoroa-theme/theme.json`.** Do not hardcode hex anywhere else.

| Token | Hex | Role (from the guidelines) |
|---|---|---|
| `rust` | `#A8461E` | Primary — logo, headings, CTAs. *Never a large background fill.* |
| `clay` | `#D98B5F` | Secondary — accents, packaging |
| `clay-soft` | `#E8B48C` | Footer headings on espresso |
| `sand` | `#EFE3D0` | **Base background — the wall colour** |
| `sand-deep` | `#E1CFAE` | Ornamental separators only |
| `white-warm` | `#FBF6EE` | Cards, header, menu surfaces |
| `espresso` | `#2E2117` | Ink — body text, dark bands |
| `espresso-soft` | `#5A4735` | Muted copy, dish descriptions |
| `olive` | `#6E7350` | Accent — tags. *Fill only, never small text.* |
| `brass` | `#A9824E` | Metallic — borders and rules. **Never text.** |

- Fonts: **Fraunces** (display) + **Work Sans** (body) + **Hind Siliguri** (BN),
  self-hosted as woff2 in `ghoroa-theme/assets/fonts/` — no Google CDN calls.
- The site is **light and sand-based**, not dark.

### Contrast rules the palette forces

`node ghoroa-theme/tools/check-contrast.mjs` reads theme.json and enforces these.

- `olive` on `sand` is **3.92:1** — fails AA for small text. Tags must therefore be
  an olive *fill* with `white-warm` text (4.61:1), never olive text.
- `brass` on `sand` is **2.77:1** — decorative only, never text.
- `sand-deep` on `white-warm` is **1.42:1** — ornamental separators only. The dotted
  price leader uses `brass` instead, because it carries meaning (it ties a dish to
  its price) and must stay visible.
- `rust` on `sand` is **4.65:1** — passes AA, but with little headroom. Do not
  lighten rust or darken sand.

---

## Logo

**Approved production mark (vertical):**

| File | Use |
|---|---|
| `frontend/assets/images/ghoroa-logo.svg` | Primary color mark |
| `frontend/assets/images/ghoroa-logo-bw.svg` | Black |
| `frontend/assets/images/ghoroa-logo-bw-white.svg` | White |
| `frontend/assets/images/ghoroa-logo-horizontal-bw.svg` | Horizontal nav wordmark |
| `frontend/assets/images/ghoroa-logo-horizontal-bw-white.svg` | Horizontal white |
| `frontend/assets/images/ghoroa-logo-transparent.png` | Raster preview |

**Do not invent logos.** Prefer human designer for brand marks.  
If refining an approved asset: polish only; never redesign from scratch.

**Do not invent a new brand.** Use the approved mark(s).

---

## Logo decision notes

- Old brick house + GH + green GHAROWA bar is the *original* client logo DNA.
- Refined versions: same house + GH + green bar, cleaner brick/geometry (no new mark).
- After a redesign was rejected by the client, stop generating logos. Only refine when given an approved image.

---

## Web development sequence (locked)

1. Prototype as design reference (`frontend/`)
2. WP staging + `theme.json` from brand tokens
3. Presence-only `ghoroa-core` CPTs (menu / location / FAQ)
4. Header/footer patterns
5. Pages: Home → Menu → About (with contact) → Order (WhatsApp) → Reservations
6. CMS content → SEO → QA → DNS go-live
7. Final payment then point DNS

**Order Now** = WhatsApp/phone until Phase 2 (Rosuii).

---

## What *not* to build in Phase 1

- Cart / WooCommerce / checkout
- Customer accounts
- POS / kitchen / rider tools
- Real online ordering checkout
- Separate Contact top-level nav
- Locations as top-level nav (unless multi-branch later)

---

## Phase 2 prep only

- Stable URLs, bilingual paths, Order Now placeholder
- Menu CPT fields for future Rosuii
- Free Rosuii demo optional in discovery — **not** paid until Phase 2

---

## Domain / hosting (ops, not build start)

- Tamjid owns domain + hosting (he pays)
- Domain parked until go-live; host only staging until Week 10
- Recommended: HostSeba BDIX Premium in Tamjid’s name
- No custom cart / POS for website

---

## Repo map (reorganised Sep 2026)

| Path | Action |
|---|---|
| `ghoroa-theme/` | **Deliverable** — WordPress block theme |
| `ghoroa-core/` | **Deliverable** — presence plugin (CPTs only, no commerce) |
| `docs/` | Scope, brand and contract documents |
| `docs/brand/Ghoroa_Brand_Guidelines.html` | Brand token source for `theme.json` |
| `docs/Ghoroa_Menu_Transcribed.md` | Menu seed data |
| `docs/Ghoroa_DEVELOPMENT_SEQUENCE.md` | Scope truth (playbook) |
| `docs/contract/ghoroa-agreement-accepted.md` | Signed agreement |
| `docs/archive/ghoroa-core-commerce-superseded/` | Old Woo commerce classes — **never reload** |
| `design/prototype-react/` | Design reference only (Vite/React). **Not deployed.** |
| `design/prototype-static/` | Older static prototype. Reference only. |

---

## What to do when opening the new Ghoroa folder

1. Open this folder as the workspace.
2. Read `AGENTS.md` + this file first.
3. Read `.cursor/rules/ghoroa.mdc` + `ponytail.mdc`.
4. Read `Ghoroa_DEVELOPMENT_SEQUENCE.md` for build order.
5. Use the approved logo files — never invent a new logo.
6. Continue Phase 1 from: prototype → WP staging → presence CPTs → pages.

---

## Current open work

**The React SPA is no longer the product.** It is design reference. The deliverable is
`ghoroa-theme/` + `ghoroa-core/`, because the contract requires content entry in
WordPress rather than hardcoded templates — Tamjid must be able to change a price
without a developer.

### Built (Sep 2026)

- `ghoroa-theme/` — block theme: `theme.json` (brand tokens), templates for all eight
  IA pages, header/footer parts, seven patterns.
- `ghoroa-core/` v2.0.0 — presence only. Registers `ghoroa_menu_item`,
  `ghoroa_location`, `ghoroa_faq` plus the `ghoroa_menu_category` taxonomy and
  bilingual meta. **WooCommerce dependency removed.**
- `ghoroa/menu-list` — the one custom block. Server-rendered; editor UI is plain
  `wp.*` JS with **no build step**, so there is no bundler to maintain at handoff.
- Fonts self-hosted as woff2; no Google CDN requests.

### Local preview — verified working

```
./tools/local-wp.sh          # WordPress on SQLite + PHP built-in server, :8088
./tools/local-wp.sh reset    # wipe and rebuild from scratch
```

No Docker or MySQL. Installs to `~/.ghoroa-wp` (outside the repo) and symlinks the
theme and plugin in, so repo edits are live on refresh. Admin is `admin` / `admin`.

**Verified from a clean bootstrap:** all 8 pages return 200, `/nope/` returns 404,
zero PHP warnings on any page, nav renders the locked five links, and 76 menu items
seed and render from the transcription.

Two setup traps, both now handled in the script — worth knowing if you build WP by
hand here:

- WP-CLI 2.12 prints PHP 8.5 deprecation notices **on stdout**, which corrupts every
  `wp option get`. That is what produced a mangled `siteurl` (`localhost:8088ghoroa-wp`)
  and, via `parse_url()` returning false, a fatal in core's `canonical.php`. The script
  runs WP-CLI with `-d error_reporting=0` and asserts `siteurl` afterwards.
- `php -m | grep -q x` under `set -o pipefail` fails on SIGPIPE even when `x` exists.

### Runnable checks (all pass)

```
npm run check                                # contrast + PHP tests
php  ghoroa-core/tests/test-menu-list.php    # 28 checks: render, bilingual, escaping, seed parsing
node ghoroa-theme/tools/check-contrast.mjs   # palette pairs + forbidden pairs, read from theme.json
node ghoroa-theme/tools/check-blocks.mjs     # block markup balance and illegal nesting
```

### Bugs the checks and the browser caught

- Dotted price leader was `sand-deep` at **1.42:1** — invisible. Now `brass`.
- Footer links inherited the global `rust` link colour: **2.64:1 on espresso**, a
  clear WCAG failure. Footer now overrides to `clay-soft` (8.42:1). The forbidden-pair
  list in the contrast script guards this.
- The nav fell back to listing *all* pages alphabetically, including Privacy and Terms.
  The five IA links are now hardcoded in `parts/header.html` rather than depending on a
  `wp_navigation` DB record.
- Seeder pulled transcription annotations into dish names ("Hunter Hangs (unclear)").
  It now strips `(unclear)` / `(duplicate…)` while keeping real portion notes like
  `(Quarter/Half/Full)`.
- A block was nested inside a `<p>` in `page-legal.html`; WordPress drops those
  silently. `check-blocks.mjs` now catches it.

### Not yet done

- Contact form plugin not chosen (Fluent Forms vs WPForms) — `/contact/` left column
  is intentionally empty until then.
- Bilingual routing not wired — Polylang vs custom still open. Menu/FAQ/location meta
  is already bilingual; page *prose* is not.
- No page copy written; About, legal and the Menu/FAQ intros are empty.
- Locations page has one placeholder branch and no Maps embed.
- Real photography still missing (see gap below); only `hero.jpg` and `kitchen.jpg`
  were on-brand enough to carry into the theme, and `hero.jpg` reads as a dosa rather
  than Bangladeshi food.

### Menu data caveats (check against the printed menu before launch)

- The transcription lists **Beef Bhuna twice in Breakfast** at different prices
  (270/320 and 170/200). The seeder matches on name within a meal period, so the
  second row overwrites the first — 76 items from 79 rows.
- Cells like `Curd / Sweet / Pudding  50 / 40 / 50` collapse to the **first** number.
- Juice and Snacks render nothing because the transcription has no such sections. Empty
  sections are hidden from visitors and show an editor-only hint when logged in.
- Source contains `Gharoa Special Naan` — likely a misspelling of Ghoroa.

### Decisions worth remembering

- **Watermelon UI: partly usable.** Registry availability splits by kind —
  `components` and `animated-components` install fine (50/50 sampled returned 200),
  but **`blocks` all 404** (`hero-*`, `footer-*`, `announcement-*`, `auth-*`). An earlier
  note claiming the whole registry was dead was wrong; it was tested on block slugs only.
- Hosted MCP `https://mcp.watermelon.sh/mcp` is registered in `.cursor/mcp.json`
  (streamable-http, no auth). Good for discovery/search; its `get_component` just proxies
  the registry, so it returns `Note: Registry returned HTTP 404` for blocks too.
- Installed via the real CLI: `card-split-accordian` → `src/components/watermelon/`,
  re-exported as `SplitAccordion` and used by `Faq.tsx`. Kept its split-border geometry and
  spring layout; restyled to forest/gold and added the accordion a11y contract
  (`aria-expanded`, `aria-controls`, `inert` on collapsed panels).
- shadcn CLI writes to a literal `./@/` folder here — move files to `src/` after install.
  `@/*` alias is wired in `vite.config.ts`, `tsconfig.json`, and `tsconfig.app.json`
  (no `baseUrl` — TypeScript 6 deprecates it).
- **Rottering has no digit glyphs** (only `one` is mapped). Numerals must never carry the
  `.display` class or they render as tofu. `npm run check` in `frontend-home/` guards this
  plus every palette contrast pair.
- **Signature dishes are a typographic menu, not photo cards** — see photography gap below.
- **Reservations uses an ornamental arch, not a photo**, so text contrast is guaranteed.

### Photography gap (blocker for further visual polish)

Only 4 of the 11 stock images are usable and on-brand:
`hero-accent.jpg` (real biryani), `curry.jpg` (= `hero-main.jpg`, duplicate), `kitchen.jpg`,
`biryani.jpg`. The rest are wrong-cuisine Western stock and are no longer referenced:

- `juice.jpg` — beer bottle + charcuterie (was mapped to "Mishti Doi"); inappropriate
- `thali.jpg` — quinoa veg bowl on white marble
- `fish.jpg` / `prawn.jpg` — salmon fillets, neither is prawn
- `khichuri.jpg` — spinach/pomegranate salad
- `dining.jpg` / `cta-dining.jpg` — same bruschetta shot, two crops

A photo gallery and photo-led dish cards are deliberately deferred until real Ghoroa
food/interior photography exists.
