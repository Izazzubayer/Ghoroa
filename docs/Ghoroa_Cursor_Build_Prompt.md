# Cursor Build Prompt — Ghoroa Direct Ordering Platform (Phase 1 MVP)

Copy everything below into Cursor as your project instructions / first agent message.

---

## Role & Context

You are building the Phase 1 MVP of a direct food-ordering platform for **Ghoroa**, a 40+ year heritage Bangladeshi restaurant currently paying ~26% commission to FoodPanda on every order. The goal of this MVP is to validate whether customers will order directly — **not** to rebuild FoodPanda. Keep every feature as operationally simple as the PRD specifies, and do not build ahead of scope (see "Explicitly Out of Scope" below) — but structure the code so Phase 2 and Phase 3 features slot in without a rewrite. That extensibility requirement is as important as the MVP feature set itself.

## Tech Stack (fixed — do not substitute)

- **CMS/Frontend:** WordPress + Elementor (page building is done visually in Elementor by the client — you are not responsible for Elementor layouts themselves, only for the code that powers everything Elementor can't do)
- **Commerce engine:** WooCommerce (orders, cart, checkout, products-as-menu-items)
- **Your job:** a custom WordPress plugin (not a child theme override dump) that extends WooCommerce with Ghoroa-specific logic
- **Hosting assumptions:** cloud hosting, SSL, CDN, daily backups, caching — build with standard WP caching plugins (WP Rocket / similar) in mind, avoid anything that breaks under full-page caching (e.g., don't hardcode nonces into cached markup)

## Architecture Principle

Build ONE custom plugin: `ghoroa-core`. Everything Ghoroa-specific — custom order statuses, delivery radius logic, rider assignment, customer records, analytics — lives here, not scattered across `functions.php` or Elementor custom code blocks. This is what makes Phase 2/3 additive instead of a rebuild.

```
ghoroa-core/
├── ghoroa-core.php                 # plugin bootstrap
├── includes/
│   ├── class-order-statuses.php    # custom WooCommerce order statuses
│   ├── class-checkout-fields.php   # delivery/pickup, area, COD-only, instructions
│   ├── class-delivery-zones.php    # radius/area config, phase-2-ready for auto fee calc
│   ├── class-rider-assignment.php  # manual assignment now, phase-3-ready schema for GPS/auto-dispatch
│   ├── class-customer-records.php  # extends WC customer data: lifetime orders, frequency, notes
│   ├── class-admin-dashboard.php   # custom admin pages (today's orders, revenue, popular items)
│   ├── class-analytics.php         # daily/weekly/monthly sales, AOV, repeat rate
│   ├── class-notifications.php     # email/SMS hooks, structured so Phase-2 swap to a proper service is a config change not a rewrite
│   ├── class-menu-availability.php # mark item unavailable/sold out without deleting product
│   └── class-bilingual.php         # Bangla/English field handling if not using WPML/Polylang
├── admin/
│   └── views/                      # PHP templates for custom admin screens
├── assets/
│   ├── css/
│   └── js/
└── languages/                      # .po/.mo for bn_BD
```

## Data Model — Build These Fields Now, Even If Only Half Used in Phase 1

This is the core extensibility move: add the fields Phase 2/3 will need as inactive/optional custom meta now, so nothing needs new database migrations later.

**Order meta (`wc_order` custom fields):**
- `_ghoroa_fulfillment_type` (`delivery` | `pickup`) — used now
- `_ghoroa_delivery_area` — used now
- `_ghoroa_delivery_fee` — used now
- `_ghoroa_special_instructions` — used now
- `_ghoroa_assigned_rider_id` — used now (manual dropdown), **structure it as a proper user/rider reference so Phase 3's rider dashboard reads the same field**
- `_ghoroa_rider_gps_ping` — placeholder field, unused in Phase 1, ready for Phase 3
- `_ghoroa_payment_gateway` — hardcode to `cod` in Phase 1, but store it as a real field so Phase 2's bKash/Nagad/SSLCommerz/card integration just writes a different value here instead of restructuring checkout
- `_ghoroa_loyalty_points_earned` — placeholder, 0 in Phase 1, Phase 2-ready

**Custom order statuses (register as real `wc-` statuses, not just order notes):**
`wc-new` → `wc-confirmed` → `wc-preparing` → `wc-ready` → `wc-out-for-delivery` → `wc-delivered` → `wc-completed`, plus `wc-cancelled`, `wc-rejected`, `wc-failed-delivery`. Register these properly via `wc_register_order_type`/status hooks so they show correctly in WooCommerce's own order list, not just your custom dashboard.

**Customer meta:**
- `_ghoroa_lifetime_orders`, `_ghoroa_order_frequency`, `_ghoroa_customer_notes`, `_ghoroa_saved_addresses` (store as serialized array even though Phase 1 only ever populates one — Phase 2's "saved addresses" feature then just becomes a UI on top of existing data)

**Delivery zones (custom post type or options table, your call):**
- Zone name, radius/areas list, flat delivery fee. Build the admin UI so a manager can add/edit zones without a developer — but keep the fee calculation flat/manual in Phase 1 (no live distance-based calculation; that's Phase 2/3 territory).

## Feature Build Order (Phase 1 scope only)

1. **Menu/product setup** — WooCommerce products as menu items, categories (Breakfast/Lunch/Dinner/Kebabs/Rice/Desserts/Drinks), image, name, description, price, availability toggle (use `class-menu-availability.php`, not product deletion)
2. **Checkout customization** — strip WooCommerce down to: name, phone, delivery address, area (from delivery zones), special instructions, fulfillment type (delivery/pickup), payment method locked to Cash on Delivery only in Phase 1 (but wired through `_ghoroa_payment_gateway` per above)
3. **Custom order statuses + admin order view** — the full lifecycle above, with manager actions (Accept/Reject/Confirm/Prepare/Ready/Out for Delivery/Delivered/Cancel) as one-click status transitions in `wp-admin`
4. **Manual rider assignment** — simple dropdown of rider names (stored as WP users with a custom `rider` role) assigned to an order; no GPS, no rider-facing app
5. **Customer management** — auto-populate customer records from orders; simple admin list view with lifetime orders, frequency, notes field
6. **Admin dashboard** — today's orders, today's revenue, pending/completed/cancelled counts, popular items — a single custom `wp-admin` page, not a separate app
7. **Analytics** — daily/weekly/monthly sales, AOV, most popular items, cancelled orders, returning customers — extend #6 or build as a second dashboard tab
8. **Notifications** — order received/confirmed/out-for-delivery/delivered via email (WooCommerce's own email system, customized templates) — do not build a dedicated notification service yet, but route everything through `class-notifications.php` so swapping to SMS/push in Phase 2 is a class-level change
9. **Bilingual (Bangla/English)** — language switcher; if not using WPML/Polylang, `class-bilingual.php` handles field-level bn/en pairs for menu items and key UI strings
10. **SEO basics** — Yoast or similar for schema markup, sitemap, Open Graph, metadata — standard config, not custom code

## Explicitly Out of Scope for Phase 1 — Do Not Build

Rider app, live GPS tracking, route optimization, automatic dispatch, multi-branch support, loyalty/membership/wallet, digital payments (bKash/Nagad/cards), coupons, POS integration, inventory management, kitchen display system, native mobile apps. If you find yourself building toward any of these, stop — you're over-scoping the MVP. The data model above already leaves room for them; the code should not include them yet.

## Non-Functional Requirements

- Full bilingual parity (Bangla/English) — not a translated afterthought, equal weight per the brand guideline
- Fast load times — this is a premium heritage brand; don't let plugin bloat undercut that
- Mobile-first — most Dhaka customers will order from a phone
- Cache-safe — anything that changes per-session (cart, checkout) must be excluded from full-page cache correctly

## Success Criteria for This Build

The client should be able to: take an order end-to-end through the full status lifecycle from `wp-admin` alone, assign a rider manually, see today's revenue and pending orders on one dashboard screen, and mark an item sold out — all without touching code. Phase 2 (digital payments, coupons, loyalty, customer accounts) and Phase 3 (rider dashboard, GPS, auto-dispatch, multi-branch) should be addable as new classes inside `ghoroa-core` that read the fields you've already created, not a re-architecture.

---

**Start by scaffolding the plugin folder structure above, registering the custom order statuses, and building the checkout field customization — in that order.**
