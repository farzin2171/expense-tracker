# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack, outputs to .next/dev)
npm run build    # production build (Turbopack by default)
npm run start    # serve production build
npm run lint     # run ESLint directly (next lint was removed in v16)
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.6** with App Router (`app/` directory). Pages Router is not used.
- **React 19.2**
- **TypeScript 5** (strict mode, `moduleResolution: bundler`)
- **Tailwind CSS v4** — configured entirely in CSS via `@theme` blocks; there is no `tailwind.config.js`
- Path alias: `@/*` resolves to the repo root

## Next.js 16 — Breaking Changes to Know

This project uses Next.js 16 which has significant differences from earlier versions. Full details are in `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.

**Async Request APIs (breaking):** `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` in layouts/pages/routes are all async. Always `await` them:

```ts
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
}
```

Run `npx next typegen` to generate `PageProps` / `LayoutProps` / `RouteContext` type helpers.

**Turbopack is the default** for both `next dev` and `next build`. Custom webpack config will break the build. Use `--webpack` flag to opt out.

**`middleware` renamed to `proxy`:** The file must be named `proxy.ts` and export a `proxy` function. The `edge` runtime is not supported in `proxy`.

**`next lint` removed:** Use `eslint` CLI directly (already wired to `npm run lint`). Linting no longer runs automatically during `next build`.

**Parallel routes** require explicit `default.js` in every slot — builds fail without them.

**Caching APIs:**
- `revalidateTag` now requires a second `cacheLife` argument: `revalidateTag('tag', 'max')`
- `cacheLife` and `cacheTag` are stable (no `unstable_` prefix)
- PPR is now `cacheComponents: true` in `next.config.ts` (not `experimental.ppr`)

**`serverRuntimeConfig` / `publicRuntimeConfig` removed.** Use `process.env` directly in Server Components; prefix with `NEXT_PUBLIC_` for client-accessible values.

## Tailwind CSS v4 Usage

Global styles live in [app/globals.css](app/globals.css). Import with `@import "tailwindcss"`. Define design tokens inside `@theme` or `@theme inline` blocks:

```css
@theme inline {
  --color-background: var(--background);
  --font-sans: var(--font-geist-sans);
}
```

There is no `tailwind.config.js` — all customization is CSS-first.

## Server vs. Client Components

All layouts and pages are Server Components by default. Add `'use client'` only at the boundary where interactivity is needed. Only `NEXT_PUBLIC_*` env vars are available in client bundles.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan at
[specs/001-expense-tracker-app/plan.md](specs/001-expense-tracker-app/plan.md).
<!-- SPECKIT END -->
