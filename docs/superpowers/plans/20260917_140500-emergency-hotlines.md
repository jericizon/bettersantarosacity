# Plan: Emergency Hotlines

**Date:** 2026-09-17
**Spec:** `docs/superpowers/specifications/SPEC-20260917-emergency-hotlines.md`

## Steps

1. `data/hotlines.json` — six verified entries (911, CDRRMO, PNP, BFP, POSO, city trunkline) with `label`/`value`/`tel` number triples, `kind`, `officialUrl`, `source`, `lastVerified`.
2. `types/civic.ts` — `HotlineNumberSchema` + `HotlineSchema` (`kind: 'emergency' | 'city'`, `numbers` min 1, optional `note`/`officialUrl`) and `Hotline` type.
3. `components/civic/Hotlines.vue` — card grid (`sm:grid-cols-2 lg:grid-cols-3`); per-card icon mapped by id (Siren, LifeBuoy, Shield, Flame, ShieldCheck, Phone), `tel:` rows with `min-h-11` targets, Source link + `DataLastVerified` footer; emergency cards get `rose-accent` border/wash, city cards stay neutral.
4. `pages/index.vue` — new `section-white` chapter after "Santa Rosa Today" (`aria-label="Emergency Hotlines"`, scroll-reveal wired via `hotlinesSection`/`useScrollReveal`), header + "Full city directory ↗" link, `<CivicHotlines />`.
5. `tests/unit/hotlines.spec.ts` — schema-validates the registry, asserts the 911 entry, counts cards and `tel:` links, asserts emergency vs city styling.

## Validation

- `pnpm vitest run tests/unit/hotlines.spec.ts` — 4/4 pass.
- `pnpm vitest run` (full suite) — 102/102 across 34 files.
- `pnpm nuxt typecheck` — clean.
- Playwright against the running dev server (`verify-hotlines.mjs`): 6 cards (4 emergency, 2 city), 14 `tel:` links (first `tel:911`), directory links present, no mobile horizontal overflow, zero page errors; desktop + mobile screenshots reviewed.
