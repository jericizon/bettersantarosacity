# Specification: Google Analytics Integration

**Date:** 2026-09-18
**Type:** New feature (NEW_FEATURE)
**Status:** Implemented

## 1. Objective

Integrate Google Analytics 4 (GA4) with the Better Santa Rosa City web application using a configurable environment variable (`NUXT_PUBLIC_GTAG_ID`), ensuring proper script loading, runtime configuration, and client-side pageview tracking during single-page navigation.

## 2. Scope

- Configure Nuxt 4 `runtimeConfig.public` to expose `gtagId` driven by `NUXT_PUBLIC_GTAG_ID` (with fallback to `NUXT_PUBLIC_GOOGLE_ANALYTICS_ID`).
- Implement Nuxt plugin (`plugins/analytics.client.ts`) that:
  - Checks for a configured Google Analytics / GTag measurement ID.
  - Initializes `window.dataLayer` and the global `gtag()` function.
  - Injects `https://www.googletagmanager.com/gtag/js?id={gtagId}` asynchronously into the document `<head>` using Nuxt's `useHead`.
  - Configures the initial measurement ID.
  - Automatically captures SPA route changes via `useRouter().afterEach`.
  - Gracefully no-ops when no measurement ID is configured (e.g. during test suites or when disabled).
- Provide `.env.example` documenting `NUXT_PUBLIC_GTAG_ID`.
- Update `.gitignore` to prevent tracking `.env` and local environment files while permitting `.env.example`.
- Create `.env` with the user-provided measurement ID (`G-KEW1P5Q9QR`) following user confirmation.

## 3. Configuration & Measurement Details

Google Tag snippet requested:
- Script tag: `https://www.googletagmanager.com/gtag/js?id=G-KEW1P5Q9QR`
- Measurement ID: `G-KEW1P5Q9QR`
- Config key: `runtimeConfig.public.gtagId`
- Primary env var: `NUXT_PUBLIC_GTAG_ID`
- Alternative env var: `NUXT_PUBLIC_GOOGLE_ANALYTICS_ID`

## 4. Constraints Honored

- No hardcoded tracking IDs in application source code.
- Client-only execution for window/DOM analytics functions (`analytics.client.ts`) to avoid hydration mismatch and avoid polluting server pre-render contexts.
- Explicit confirmation obtained before creating `.env`.
- No new heavy dependencies introduced.
- Existing tests and typechecks remain passing.
