# Ghoroa — WordPress setup

How the repo maps onto a WordPress install. Follow this in order on a fresh staging site.

---

## 0. Local preview first

To see the site before touching a host:

```bash
./tools/local-wp.sh          # http://localhost:8088, admin / admin
./tools/local-wp.sh reset    # wipe and rebuild
```

This installs WordPress on SQLite behind PHP's built-in server — no Docker, no MySQL —
into `~/.ghoroa-wp`, symlinks the theme and plugin, creates all eight pages and seeds
the menu. It performs every step in the rest of this document automatically, so use it
to sanity-check changes and use the manual steps below on real hosting.

---

## 1. Install

```text
WordPress 6.5+   PHP 8.2+   SSL
```

Copy the two folders in:

| Repo path | WordPress path |
|---|---|
| `ghoroa-theme/` | `wp-content/themes/ghoroa-theme/` |
| `ghoroa-core/` | `wp-content/plugins/ghoroa-core/` |

Activate the plugin **before** the theme. Activation registers the content types and
seeds the five meal periods, so the menu templates have something to query.

Set permalinks to **Post name** (`/%postname%/`). The templates link to `/menu/`,
`/about/` and so on; plain permalinks will 404.

---

## 2. Create the eight pages

Pages → Add New for each. The **Slug** column is not optional — templates link to
these exact paths.

| # | Page title | Slug | Template to assign |
|---|---|---|---|
| 1 | Home | `home` | *(front page — uses `front-page.html` automatically)* |
| 2 | Menu | `menu` | **Menu page** |
| 3 | About | `about` | *(default)* |
| 4 | Locations | `locations` | **Locations page** |
| 5 | Contact | `contact` | **Contact page** |
| 6 | FAQ | `faq` | **FAQ page** |
| 7 | Privacy Policy | `privacy-policy` | **Legal page** |
| 8 | Terms | `terms` | **Legal page** |

Assign a template in the editor sidebar under **Page → Template**.

Then Settings → Reading → *Your homepage displays* → **A static page** → Home.

About uses the default template on purpose: it is ordinary prose, so it needs no
special layout. Don't create a template for it.

---

## 3. Build the navigation

Appearance → Editor → Navigation. Create one menu with exactly these five links:

```text
Home · Menu · About · Locations · Contact
```

The header's **Order Now** button is separate from the nav — it lives in the header
template part. In Phase 1 it points at `/contact/`. Change it to WhatsApp or the
Rosuii URL by editing that one button.

Footer links (FAQ, Privacy, Terms) are hardcoded in `parts/footer.html` and only need
touching if a slug changes.

---

## 4. Enter the menu

Menu items live under **Menu items** in the dashboard, not in the page content.

Each item has, in the sidebar:

| Field | Notes |
|---|---|
| `name_en` / `name_bn` | Dish name. Falls back to the post title if blank. |
| `desc_en` / `desc_bn` | Optional one-liner |
| `price_takeaway` | Whole taka |
| `price_eatin` | Omit if the same as takeaway — it won't print twice |
| `available` | Untick to show a "Sold out" tag without deleting the item |
| `featured` | Shows the dish in the Home page's featured strip |
| Meal period | Breakfast / Lunch / Dinner / Juice bar / Snacks |

Order within a section comes from **Page Attributes → Order**.

### Bulk seed from the transcription

```bash
wp eval-file wp-content/plugins/ghoroa-core/tools/seed-menu.php \
  /path/to/docs/Ghoroa_Menu_Transcribed.md
```

Idempotent — re-running updates prices rather than duplicating items. Prices the
transcription marked `---` or `(unclear)` are skipped and listed in the output; enter
those by hand.

**Check the seeded data against the printed menu before launch.** The source was
transcribed from photographs and has at least one known duplicate ("Beef Bhuna"
appears twice in Breakfast at different prices).

---

## 5. Locations and FAQ

Same idea — both are content types, not page content.

- **Locations:** title, address, phone, hours, and a Google Maps embed URL. They
  render on `/locations/` in Page Attributes order.
- **FAQs:** title is the question, body is the answer. They render on `/faq/`.

Anything you type into the Menu, Locations or FAQ *page* body appears **above** the
generated list, which is the right place for an intro paragraph.

---

## 6. Plugins

Keep to five to eight, per the sustainability rules.

| Purpose | Suggestion |
|---|---|
| SEO | Rank Math or Yoast |
| Cache | LiteSpeed Cache or WP Rocket |
| Security | Wordfence, or the host's WAF |
| Contact form | Fluent Forms or WPForms — **still to be chosen** |
| Bilingual | Polylang — **still to be chosen** |

**Do not install:** WooCommerce, Elementor, or any page builder. The theme is a block
theme; a builder would fight it and break the token system.

### Contact form

The form is not built yet. When it is, put it in the left column of `/contact/`; the
right column already holds phone, WhatsApp, email and hours. Include a "Reservation
enquiry" subject option — reservations are handled here rather than on their own page.

---

## 7. Bilingual

Menu items, locations and FAQs already store Bangla in meta, and the menu block swaps
languages off `determine_locale()`. That works with Polylang, WPML, or a plain `bn_BD`
site with no extra code.

Page *content* (About, FAQ prose, legal) still needs a translation plugin or duplicate
pages. Decide before Week 7 copywriting, since it changes how the copy is entered.

---

## 8. Before go-live

- [ ] Contrast and rendering checks pass:
      `node ghoroa-theme/tools/check-contrast.mjs` and
      `php ghoroa-core/tests/test-menu-list.php`
- [ ] Every page has a title and meta description (EN + BN)
- [ ] LocalBusiness JSON-LD on Home and Contact
- [ ] XML sitemap submitted to Search Console
- [ ] Maps embeds load on Locations and Contact
- [ ] Contact form delivers to the right inbox
- [ ] Keyboard-only pass: skip link, nav, mobile menu, form
- [ ] Mobile LCP under 2.5s
- [ ] No cart, checkout or ordering anywhere on the site
- [ ] Staging `noindex` removed

---

## Phase 2 — what changes

Almost nothing on this site. Rosuii is a separate hosted product.

1. Tamjid subscribes to Rosuii and brands the storefront.
2. Menu and prices are entered there — same data as the menu CPT, which is why the
   field names match.
3. Point **Order Now** in `parts/header.html` at the Rosuii URL.

KDS, order processing and dashboards all live inside Rosuii. **Do not build them into
this theme or plugin.** The archived commerce code in
`docs/archive/ghoroa-core-commerce-superseded/` was an earlier attempt at exactly that
and is kept only for reference — never reload it.
