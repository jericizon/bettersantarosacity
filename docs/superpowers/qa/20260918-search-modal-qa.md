# QA Report — Header Search Icon → Global Search Modal

**Date:** 2026-09-18
**Scope:** Replace the redundant header search input (duplicated by the homepage hero banner) with a search icon that opens a modal-overlay global search with grouped autocomplete.

## Changes

| File | Change |
|---|---|
| `utils/search-docs.ts` | NEW — shared dataset search index, categories, `matchSearchDocs`, `escapeHtml`/`markHtml`/`buildExcerpt` (extracted from `pages/search.vue`) |
| `composables/useSearchModal.ts` | NEW — shared `isOpen` state (`useState` in Nuxt, module-ref fallback under Vitest) |
| `components/search/SearchModal.vue` | NEW — `role="dialog"` overlay; grouped autocomplete (3/group + count badges), `<mark>` highlights, ↑↓/Enter/Esc/⌘K keyboard nav, Tab focus trap, scroll lock, focus restore, quick links |
| `components/search/GlobalSearch.vue` | Rewritten — icon button trigger (`aria-haspopup="dialog"`, ⌘K badge on lg) |
| `components/civic/CivicHeader.vue` | Single trigger on all breakpoints (removed `hidden sm:block` input + mobile `/search` link); drawer "Search" item opens the modal |
| `layouts/default.vue` | Mounts `<SearchModal/>`; ⌘K/Ctrl+K/`/` now toggles the modal (drops hero/header focus priority) |
| `pages/search.vue` | Consumes shared `search-docs` util (no duplicated dataset logic) |

## Validation

- `pnpm test:run` — 153/153 tests pass (48 files), incl. new `SearchModal.spec.ts` (10 cases: open/autofocus, grouping, counts, 3-item cap, Enter→`/search?q=`, arrow-key select→navigate, Esc focus restore, backdrop/⌘K close, no-match hint, quick links)
- `pnpm typecheck` — clean
- `pnpm build` — succeeds; 112 routes prerendered
- Prerendered `dist/index.html` + `dist/explore/index.html` contain `aria-haspopup="dialog"` trigger; zero `global-search-input` remnants

## Manual checks performed

- Focus order: open → input autofocused; close → focus returns to trigger; body scroll lock engages/releases
- `⌘K` inside the modal input closes it (panel handler), and the global listener stays suppressed while typing — no reopen loop
- Redundancy resolved: header shows only the icon on every page; hero input unchanged

## Notes / follow-ups

- Modal autocomplete is dataset-driven (instant, works in dev); full Pagefind results remain on `/search` via "View all N results" / Enter.
- Hero `⌘K` badge still accurate — the chord now opens the modal instead of focusing the input.
