# Plan: Google Analytics Integration

**Date:** 2026-09-18
**Spec:** `docs/superpowers/specifications/SPEC-20260918-google-analytics.md`

## Steps

1. `.gitignore` & `.env.example`:
   - Add `.env` and `.env.*` (excluding `!.env.example`) to `.gitignore`.
   - Create `.env.example` with `NUXT_PUBLIC_GTAG_ID=`.
2. `.env`:
   - Create `.env` containing `NUXT_PUBLIC_GTAG_ID=G-KEW1P5Q9QR` per user confirmation.
3. `nuxt.config.ts`:
   - Declare `runtimeConfig.public.gtagId: process.env.NUXT_PUBLIC_GTAG_ID || process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''`.
4. `plugins/analytics.client.ts`:
   - Create Nuxt client-side plugin reading `gtagId` from `useRuntimeConfig().public.gtagId`.
   - If missing/empty, return early without side-effects.
   - Initialize `window.dataLayer = window.dataLayer || []` and `gtag()` function.
   - Queue initial `js` timestamp and `config` command.
   - Inject script tag `https://www.googletagmanager.com/gtag/js?id=${gtagId}` using `useHead`.
   - Register `useRouter().afterEach` handler to trigger `gtag('config', gtagId, { page_path: to.fullPath })` on SPA page transitions.
5. Unit Testing:
   - Create `tests/unit/analytics.spec.ts` asserting:
     - Plugin handles empty gtagId gracefully (no-ops, no DOM mutations).
     - Plugin initializes dataLayer and executes gtag commands with valid ID.
     - Plugin sets up router hook and updates page_path on navigation.
     - Script tag injected via `useHead` targets correct Google Tag Manager URL.
6. Verification & QA:
   - Run Vitest test suite (`pnpm test:run`).
   - Run Nuxt typecheck (`pnpm typecheck`).
   - Run `pnpm run generate` to verify build succeeds cleanly.
   - Compile QA report at `docs/superpowers/qa/20260918-google-analytics-qa.md`.
