# Ghoroa — headless web

Production frontend: `ghoroa-web/`. WordPress CMS: `ghoroa-core/`.

## What is live

- Next App Router with forest/gold design from `design/prototype-react/`
- Locale routes `/en` and `/bn`
- CMS REST: `/wp-json/ghoroa/v1/{menu,locations,faqs,settings,pages}`
- Revalidation: WordPress publish hooks → `/api/revalidate`
- Contact: `/api/contact` (validated, rate-limited)

## Environment

Copy `ghoroa-web/.env.example` → `.env.local` and set:

- `NEXT_PUBLIC_WP_URL`
- `NEXT_PUBLIC_SITE_URL`
- `GHOROA_REVALIDATE_SECRET`
- `GHOROA_PREVIEW_SECRET`

## Checks

```
node ghoroa-web/scripts/check-headless.mjs
npm run build --prefix ghoroa-web
php ghoroa-core/tests/test-menu-list.php
```
