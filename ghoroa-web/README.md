# Headless Ghoroa — production frontend

`ghoroa-web/` is the production Next.js App Router site. WordPress remains the CMS.

## Routes

- `/en` and `/bn` for Home · Menu · About · Locations · Contact · FAQ · Privacy · Terms
- `/api/revalidate` — signed tag revalidation (WordPress → Next)
- `/api/contact` — validated reservation form

## Local run

```bash
# WordPress CMS (already seeded via ghoroa-core)
# Next frontend
cd ghoroa-web
cp .env.example .env.local
# set NEXT_PUBLIC_WP_URL and GHOROA_REVALIDATE_SECRET
npm install
npm run dev
```

## Env

See `.env.example`.

## Checks

```bash
node ghoroa-web/scripts/check-headless.mjs
php ghoroa-core/tests/test-menu-list.php
node ghoroa-theme/tools/check-contrast.mjs
```

## Design source

Forest/gold look is ported from `design/prototype-react/`. Do not invent a new palette.
