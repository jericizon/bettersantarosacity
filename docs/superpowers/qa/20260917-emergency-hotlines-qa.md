# QA Report — Emergency Hotlines

**Date:** 2026-09-17
**Spec:** `docs/superpowers/specifications/SPEC-20260917-emergency-hotlines.md`
**Method:** Vitest (schema + component) and Playwright against the user-managed dev server on :4027; desktop 1440px and mobile 390px screenshots reviewed.

## Verdict: PASS

> **Revision:** the card-grid section was replaced by a compact marquee strip (`HotlineTicker.vue`) pinned to the hero's top edge, per user feedback. Checklist below reflects the ticker; the card-section implementation was validated earlier in the same session.

## Checklist

| # | Criterion | Result |
|---|---|---|
| 1 | Hotline registry validates against `HotlineSchema` | PASS — 6 entries parse; suite asserts `>= 5` |
| 2 | National 911 present and dialable | PASS — `tel:911` leads the strip |
| 3 | Instantly visible on landing | PASS — thin band (34px) at the hero's top edge, no scroll needed |
| 4 | Numbers are tap-to-call `tel:` anchors | PASS — 12 links rendered (6 agencies × 2 loop copies), E.164 hrefs, mobile numbers preferred for tap targets |
| 5 | Flash-strip motion | PASS — marquee animates; pauses on hover/focus; disabled under `prefers-reduced-motion` (becomes manually scrollable) |
| 6 | Accessibility | PASS — `role="region"` + `aria-label`; duplicate loop copy is `aria-hidden` so numbers announce once |
| 7 | Responsive, no overflow | PASS — 390px viewport: `scrollWidth <= innerWidth`, no heading overlap |
| 8 | No console/page errors | PASS — zero `pageerror` events during probe |
| 9 | Regressions | PASS — full suite 102/102, typecheck clean, homepage spec untouched |

## Numbers verified against

`https://santarosacity.gov.ph/city-directory` (CDRRMO, POSO, BFP, PNP, trunkline) and `https://e911.gov.ph` (911). `lastVerified: 2026-09-17` on all entries.

## Notes / residual risks

- `tel:` hrefs for bare 7-digit landlines are normalized to `+63 49 …`, inferred from the (049) trunkline exchange in the same directory. If any number is actually an (02) line, dialing from outside Laguna could misroute; the display value remains exactly as published.
- Numbers can go stale; `lastVerified` plus per-card Source links are the intended freshness signal.
