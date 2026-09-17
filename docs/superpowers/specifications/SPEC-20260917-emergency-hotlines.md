# Specification: Emergency Hotlines

**Date:** 2026-09-17
**Type:** New feature (NEW_FEATURE)
**Status:** Implemented

## 1. Objective

Surface emergency contact numbers for Santa Rosa City on the homepage so residents can reach urgent services quickly, especially on mobile where numbers must be tap-to-call.

## 2. Scope

**Revised:** the full card section was cut in favor of a compact flash strip — the user wants key numbers instantly visible without a dedicated section.

- A slim ticker band (`HotlineTicker.vue`) pinned to the top edge of the hero banner: an "EMERGENCY" label with a pulsing siren icon, then one tap-to-call `tel:` link per agency scrolling in a seamless marquee.
- Data-driven from `data/hotlines.json`, validated by `HotlineSchema` in `types/civic.ts` (adds optional `tag` for compact labels and `note`).
- The strip picks each agency's mobile number when one exists (better tap target); `kind: 'emergency' | 'city'` remains in the data for any future full presentation.
- Marquee pauses on hover/focus-within; under `prefers-reduced-motion` the scroll stops and the strip becomes manually scrollable.
- Duplicate track copy is `aria-hidden` so assistive tech hears each number once.

## 3. Data sources

Primary source: official city directory at `https://santarosacity.gov.ph/city-directory`. National 911 from `https://e911.gov.ph`. Third-party directories are not used as a basis.

| id | Agency | Numbers |
|---|---|---|
| e911 | Emergency 911 National Office | 911 |
| cdrrmo | CDRRMO Command Center | 0995 650 1943, 0999 873 5431, 572-4001, 530-2569 |
| pnp | Santa Rosa City Police Station | 559-6593, 566-7312, 0999 483 5681 |
| bfp | Santa Rosa Fire Station | 534-1291, 831-8979 |
| poso | Public Order & Safety Office | 0961 722 1414, (049) 530-0015 loc. 1052 |
| city-trunk | Santa Rosa City Hall | (049) 530-0015, (02) 8519-4024 |

`tel:` hrefs normalize to E.164 (`+63 49 …` for landlines, `+63 9xx …` for mobiles). The bare 7-digit landlines are dialed within the (049) exchange per the directory context.

## 4. Constraints honored

- Zero em-dashes in user-facing UI copy.
- Independent/community positioning preserved: entries cite official sources in the data; the site does not present itself as a government portal.
- Existing patterns reused: zod schema + JSON data registry, Lucide icons.
- No new dependencies.

## 5. Out of scope

- A dedicated `/hotlines` page or full card grid (the registry + schema already support it if the user wants one later).
- Non-emergency departmental directory (barangay halls, hospitals) — can extend `hotlines.json` later with a new `kind`.
