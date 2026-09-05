# Ghoroa headless migration status

- **Frontend:** `ghoroa-web/` — Next.js App Router, Vercel.
- **CMS:** `ghoroa-core/` — public REST under `/ghoroa/v1` (menu, locations, faqs, settings, pages).
- **Revalidation:** WordPress publish hooks → Next `/api/revalidate`.
- **IA:** Home · Menu · About · Locations · Contact (+ FAQ, Privacy, Terms).
- **Order Now:** CMS setting; Phase 1 WhatsApp, Phase 2 Rosuii.
- **Block theme:** `ghoroa-theme/` is non-production fallback only.

## Setup

1. Activate/install `ghoroa-core` with settings (phone, WhatsApp, Order Now URL).
2. Publish menu/locations/FAQ in WordPress.
3. Deploy `ghoroa-web` to Vercel with `NEXT_PUBLIC_WP_URL` and `GHOROA_REVALIDATE_SECRET`.
4. Set `GHOROA_WP_URL` in WP options or env for `wp_remote_post` revalidate calls.

See `ghoroa-web/README.md`.
