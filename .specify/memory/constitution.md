<!-- SYNC IMPACT REPORT
Version Change: N/A (placeholder template) → 1.0.0
Modified Principles: N/A — initial ratification (all sections filled from template)
Added Sections:
  - I. Clean & Modular Code (NEW)
  - II. Next.js 16 App Router First (NEW)
  - III. Server Components by Default (NEW)
  - IV. TypeScript Strict Mode (NEW)
  - V. Simplicity & YAGNI (NEW)
  - Tech Stack Constraints (NEW)
  - Development Workflow (NEW)
  - Governance (NEW)
Templates Reviewed:
  - .specify/templates/plan-template.md ✅ (Constitution Check gate placeholder is dynamic — no change needed)
  - .specify/templates/spec-template.md ✅ (no mandatory sections added/removed — no change needed)
  - .specify/templates/tasks-template.md ✅ (task categories align with principles — no change needed)
Deferred Items: None
-->

# Expense Tracker Constitution

## Core Principles

### I. Clean & Modular Code

Every component, hook, utility, and route segment MUST have a single, clearly stated
responsibility. Mixed concerns — data fetching, business logic, and presentation in the
same file — are forbidden. Files MUST remain small enough to be understood in isolation.
Abstractions MUST earn their place: three nearly identical blocks of code justify an
abstraction; two do not. No half-finished implementations may be merged.

**Rationale**: Modular code is the primary maintainability lever. In a Next.js App Router
project the natural units are route segments, Server Components, Client Components, and
shared utilities — keep each narrow.

### II. Next.js 16 App Router First

The App Router (`app/` directory) is the only routing layer; the Pages Router MUST NOT
be used. All async Request APIs — `cookies()`, `headers()`, `draftMode()`, `params`,
`searchParams` — MUST be `await`-ed; synchronous access throws at runtime in Next.js 16.
Custom webpack configuration is forbidden; Turbopack is the default for both `next dev`
and `next build`. `npx next typegen` MUST be run to regenerate `PageProps` / `LayoutProps`
/ `RouteContext` type helpers after adding, renaming, or removing routes. Parallel routes
MUST include an explicit `default.js` in every slot — builds fail without them.

**Rationale**: Next.js 16 introduced breaking async-API changes and removed several
legacy features. Following the canonical App Router patterns prevents runtime errors and
keeps the project on a supported upgrade path.

### III. Server Components by Default

Every layout and page is a Server Component unless interactivity explicitly requires
`'use client'`. The `'use client'` boundary MUST be pushed as far down the component
tree as possible to maximise server-side rendering. Server Components MUST NOT import
client-only modules (hooks, browser APIs). Only `NEXT_PUBLIC_*`-prefixed environment
variables are accessible in client bundles; sensitive values MUST remain server-side.

**Rationale**: Server Components reduce bundle size and improve initial load performance.
Minimising the client boundary also limits the surface area where secrets can leak into
the browser.

### IV. TypeScript Strict Mode

TypeScript strict mode is non-negotiable and MUST remain enabled in `tsconfig.json`.
`any` is forbidden; type assertions (`as T`) require an inline comment explaining why
the type system cannot express the invariant. `moduleResolution: bundler` and the `@/*`
path alias MUST be preserved. All new source files MUST use `.ts` or `.tsx` extensions.

**Rationale**: Strict TypeScript catches the class of bugs — null-derefs, wrong shapes,
unchecked casts — that are especially common in data-driven applications like an expense
tracker.

### V. Simplicity & YAGNI

Features are built for current, stated requirements only. No speculative generalisation,
no "we might need this later" abstractions, no feature flags for hypothetical variants.
Error handling, fallbacks, and validation are added only at system boundaries (user input,
external APIs) — never for impossible internal states. A direct implementation is always
preferred over a design pattern.

**Rationale**: Over-engineering is the most common source of complexity debt in small
applications. Keeping the code minimal preserves optionality for future requirements
that actually materialise.

## Tech Stack Constraints

- **Framework**: Next.js 16.2.6 — App Router exclusively; Turbopack is the build default.
- **Language**: TypeScript 5, strict mode, `moduleResolution: bundler`.
- **Runtime**: React 19.2 — Server Components first; `'use client'` only at interactivity
  boundaries.
- **Styling**: Tailwind CSS v4 — CSS-first via `@theme` / `@theme inline` blocks in
  `app/globals.css`; no `tailwind.config.js` is used or permitted.
- **Path alias**: `@/*` resolves to the repository root.
- **Linting**: ESLint via `npm run lint`; linting does NOT run automatically on build
  (`next lint` was removed in Next.js 16).
- **Runtime config**: `serverRuntimeConfig` / `publicRuntimeConfig` are removed in
  Next.js 16; use `process.env` directly in Server Components and `NEXT_PUBLIC_*` for
  client-accessible values.

## Development Workflow

- Every PR is reviewed against all five Core Principles before merge.
- No test runner is configured yet; a testing strategy MUST be agreed and documented
  before the first production release.
- Standard commands: `npm run dev` (dev server, Turbopack), `npm run build` (production),
  `npm run start` (serve production build), `npm run lint` (ESLint).
- Run `npx next typegen` after any route changes to keep type helpers current.
- Commits MUST be atomic and focused; each commit SHOULD represent one logical change.

## Governance

This constitution supersedes all other informal practices and conventions for the
Expense Tracker project. Amendments require:

1. A version bump following semantic versioning:
   - **MAJOR**: Principle removal or backward-incompatible redefinition.
   - **MINOR**: New principle or section added, or material expansion of existing guidance.
   - **PATCH**: Clarification, wording refinement, or typo fix.
2. Update of `LAST_AMENDED_DATE` to the amendment date (ISO 8601).
3. Propagation of changes to all dependent templates (see Sync Impact Report).
4. Review and acknowledgement in the PR that introduces the amendment.

All PRs touching architecture or new features MUST verify compliance with the
Constitution Check gates in `plan-template.md`.

**Version**: 1.0.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-05-11
