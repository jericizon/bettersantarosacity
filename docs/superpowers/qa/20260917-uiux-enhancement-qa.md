# QA Report — Better Santa Rosa City UI/UX Enhancement

**Date:** 2026-09-17
**Spec:** `docs/superpowers/specifications/SPEC-20260917-better-santa-rosa-city-uiux-enhancement.md`
**Method:** Static inspection of prerendered `dist/` output (no dev/preview server — banned). Minified HTML checked via `grep -o` counts and exact-string matching.

> **Re-validation note:** A prior run of this report validated a STALE `dist/` (built before the latest fixes). The build cache has since been cleared and `pnpm run build:prod` re-run; `dist/` artifacts are timestamped 2026-09-17 04:23. All results below are against the fresh build and supersede the stale run entirely.

## Verdict: PARTIAL PASS — 7 of 8 checklist items pass; banned em-dash persists on subpages

---

## 1. Chapter sequence & tones — PASS

All 11 homepage chapters carry the specified tone class on their `<section>` element, in the specified DOM order (verified via `<section>` tag extraction):

| # | Section (aria-label/labelledby) | Class | Expected | ✓ |
|---|---|---|---|---|
| 1 | `hero-heading` | `section-parchment` | `section-parchment` | ✓ |
| 2 | `today-heading` | `section-white` | `section-white` | ✓ |
| 3 | "Explore Santa Rosa" | `section-light-green` | `section-light-green` | ✓ |
| 4 | "City Money" | `section-parchment` | `section-parchment` | ✓ |
| 5 | "Building the City" | `section-white` | `section-white` | ✓ |
| 6 | "From Bukol to Today" | `section-deep-green` | `section-deep-green` | ✓ |
| 7 | "Santa Rosa Life & Heritage" | `section-parchment` | `section-parchment` | ✓ |
| 8 | "Laws & Decisions" | `section-white` | `section-white` | ✓ |
| 9 | "Services" | `section-white` | `section-white` | ✓ |
| 10 | "Data & Downloads" | `section-parchment` | `section-parchment` | ✓ |
| 11 | "Data Trust" | `section-white` | `section-white` | ✓ |

"Data & Downloads" chapter now exists; DOM order matches spec (history before collage, then laws/services). Counts: `section-parchment`×4, `section-white`×5, `section-light-green`×1, `section-deep-green`×1.

## 2. Required copy — PASS (16 of 16 verbatim)

Occurrence counts in `dist/index.html`: "Public information about Santa Rosa, made easier to find." ×1, "Independent community project" ×2, "Not an official City Government website" ×1, **"Simplified map for information purposes. Not official cadastral survey data." ×1 (exactly once)**, "How city revenue has changed" ×1, "₱6.251B" ×4, "Commission on Audit" ×5, "Building the City" ×2, "From Bukol to Today" ×2, "From a lakeside barrio of Biñan to cityhood" ×1, "Laws & Decisions" ×2 (as `&amp;`), "Data & Downloads" ×2 (as `&amp;`), "Data Trust" ×2, "About this project" ×1, "Last verified" ×22, "Photo:" ×9.

## 3. Banned content — FAIL on subpages (homepage clean)

- `dist/index.html`: **0 em-dashes** (`—`, U+2014); "Richest city"/"richest city" ×0, "largest of any city" ×0, "outside Metro Manila" ×0. Homepage passes.
- **Site-wide:** 164 em-dashes across 40 `dist/**/*.html` files. All four spot-check subpages affected: `explore` ×17, `money` ×11, `barangays` ×5, `about/media` ×3; `404.html` ×1.
- Em-dashes occur in `<title>` (site pattern "Page — Better Santa Rosa City"; homepage uses `·` instead), meta `og:title`/`description`, and rendered body copy — e.g. `barangays`: "…what the cited sources support — missing information is labeled, never filled in."; `about/media`: "…released under an open license — credited below."
- Banned superlative phrases: 0 occurrences in every dist HTML file. ✓

## 4. Assets resolve — PASS

16 unique `src=`/`href=` refs under `/images/` and `/data/` across all dist HTML all resolve to real files (5 landmark SVGs, logo SVG, 9 JSON data files). `/data/_payload.json?_b=…` resolves to `dist/data/_payload.json` (the `?_b=` param is a Nuxt cache-buster). `/images/bettersantarosacity-logo.svg` exists (70,427 B).

## 5. A11y surface — PASS

- `aria-labelledby="hero-heading"` on hero `<section>` + `id="hero-heading"` on the h1 — ✓
- `<nav aria-label>` ×3 ("Primary", "Public data", "Transparency") — ✓
- `<label for="barangay-mobile-select">` ↔ `<select id="barangay-mobile-select">` — ✓; `global-search-input` and `hero-search-input` labels also pair with real input ids — ✓
- Note (carried from prior run, not in checklist): 1 `alt=""` remains on a site emblem `<img>`; all content images now have descriptive alt text.

## 6. Search index — PASS

`dist/pagefind/` contains 54 files: `pagefind.js`, `pagefind-entry.json`, `index/*.pf_index`, `fragment/`, `filter/`, UI bundles, wasm. Pagefind ran during the fresh build.

## 7. Subpage spot-check — PASS

| Page | Size | `max-w-7xl` | Footer disclaimer "Not an official City Government website" |
|---|---|---|---|
| `explore/index.html` | 50,788 B | ×4 | ×1 ✓ |
| `money/index.html` | 25,815 B | ×4 | ×1 ✓ |
| `about/media/index.html` | 22,065 B | ×3 | ×1 ✓ |
| `barangays/index.html` | 34,754 B | ×4 | ×1 ✓ |

All four render real content (`<h1>`s present: "Explore Santa Rosa", "City Finances", "Media & Photography Credits", "Barangays").

## 8. Redirects/routing — PASS

`dist/404.html` (1,771 B), `dist/sitemap.xml` (4,056 B, valid urlset), `dist/_redirects` (`/* /404.html 404`), `200.html`, `robots.txt` all present.

---

## Summary of remaining fixes

1. **Purge em-dash (U+2014) site-wide**: 164 instances across 40 HTML files — fix the " — Better Santa Rosa City" title suffix pattern (SEO/head composable), meta descriptions, and remaining body copy. Homepage already complies (uses `·`).
2. Optional: document the single decorative `alt=""` emblem or give it non-empty alt.

## Superseded stale-run findings (for audit trail only)

The invalidated run reported: missing/wrong tone classes on 10 of 11 sections, absent "Data & Downloads" chapter, 7 missing verbatim strings, "Richest city … outside Metro Manila" claims in history, and 13 em-dashes on the homepage — all confirmed FIXED in the fresh build except the site-wide em-dash residue noted above.
