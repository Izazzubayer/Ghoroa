# Ghoroa — agent instructions

This repo uses [Ponytail](https://github.com/DietrichGebert/ponytail) lazy senior dev
mode. Cursor rules live in `.cursor/rules/ponytail.mdc` and `.cursor/rules/ghoroa.mdc`.

## Ponytail ladder

Before writing code:

1. Does this need to exist? (YAGNI)
2. Already in this codebase? Reuse it.
3. Stdlib / native platform? Use it.
4. Installed dependency? Use it.
5. One line? One line.
6. Minimum that works.

Deletion over addition. No new dependencies without reason. Shortest correct diff wins.

**Never skip:** accessibility, security at trust boundaries, error handling that
prevents data loss, anything explicitly requested.

## Read first

1. **`Ghoroa_MEMORY.md`** — locked decisions and current state
2. `.cursor/rules/ghoroa.mdc` — project rules
3. `docs/Ghoroa_DEVELOPMENT_SEQUENCE.md` — build playbook
4. `docs/contract/ghoroa-agreement-accepted.md` — signed scope, wins any conflict

## What this project is

A WordPress site for a Bangladeshi restaurant, built in two phases.

**Phase 1 (now):** marketing site — brand, bilingual menu, SEO. No commerce.
**Phase 2 (later):** ordering, POS and KDS via **Rosuii**, an external SaaS. Not built
here; the site only needs to repoint its *Order Now* button.

## Deliverable vs reference

| Path | Role |
|---|---|
| `ghoroa-web/` | **Production frontend** — Next.js App Router (Vercel) |
| `ghoroa-theme/` | WordPress block theme — non-production fallback |
| `ghoroa-core/` | Presence plugin — CPTs + public REST (`/ghoroa/v1`) |
| `design/` | Design references. **Never deployed.** |
| `docs/` | Scope, brand, contract |

Content belongs in the CMS. If you find yourself hardcoding a dish or a price into a
template, stop — it goes in the menu CPT.

## Locked IA (matches the signed agreement)

Nav: Home · Menu · About · Locations · Contact
Header: *Order Now* button (WhatsApp/phone in Phase 1)
Footer: FAQ · Privacy · Terms · hours/phone/WhatsApp

Reservations is a form on `/contact/`, not a page. There is no online ordering.

Locale routes: `/en/...` and `/bn/...` (root `/` redirects to `/en`).

## Brand

`ghoroa-web/src/app/globals.css` + design tokens from `design/prototype-react/`
(forest/gold). Tokens live in CSS `@theme`. `ghoroa-theme/theme.json` is still the
block-theme reference. Approved logos only; never invent one.

## Checks

```
php ghoroa-core/tests/test-menu-list.php
node ghoroa-theme/tools/check-contrast.mjs
node ghoroa-web/scripts/check-headless.mjs
npm run build --prefix ghoroa-web
```
