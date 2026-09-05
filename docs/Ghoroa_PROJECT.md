# Ghoroa — Project handoff

Open this file when you start a new chat in the Ghoroa folder.

## Why this folder exists

The project was renamed from `Gharowa` → `Ghoroa` so brand and path match the restaurant name.

## Conversation continuity

1. Read **`Ghoroa_MEMORY.md`** (this is the handoff).
2. Read **`AGENTS.md`** and **`.cursor/rules/ghoroa.mdc`**.
3. Read **`Ghoroa_DEVELOPMENT_SEQUENCE.md`**.
4. Use the approved logo files under `frontend/assets/images/ghoroa-logo*`.

## How to continue work

Cursor does not automatically carry the previous chat transcript across a folder rename.  
This file is the **memory** of locked decisions so you (and any agent) can resume without re-learning the project.

---

### Locked decisions (do not reverse)

| Decision | Rule |
|---|---|
| Phase 1 scope | Marketing site only — no cart / checkout / POS |
| Site IA | Home · Menu · Online Order · Reservations · About+contact |
| Order path | WhatsApp + phone until Rosuii |
| Accounts | Not in Phase 1 |
| POS | Not website; Tamjid later via Rosuii |
| Design system | `theme.css` only; Newsreader + DM Sans + Hind Siliguri |
| Brand red | `#E6302E` |
| Logos | Approved `ghoroa-logo*` only — never invent |
| Images | Local under `assets/images/food/` — never Unsplash |

### Current status

- Prototype exists in `frontend/`
- Brand logos exist under `frontend/assets/images/`
- WordPress theme + `ghoroa-core` presence not started for production
- Domain / hosting: Tamjid owns and pays; staging later

### Next logical build step

1. Keep polishing `frontend/` as design reference  
2. Scaffold WP staging + theme skeleton  
3. Presence-only `ghoroa-core` CPTs  
4. Build pages in order: Home → Menu → About → Order → Reservations  

---

If you want, paste the next task here and we continue from this memory.
