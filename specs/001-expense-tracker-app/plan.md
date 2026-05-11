# Implementation Plan: Personal Expense Tracker

**Branch**: `001-expense-tracker-app` | **Date**: 2026-05-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-expense-tracker-app/spec.md`

## Summary

A single-user personal expense tracker built on Next.js 16 App Router. All expense data is
persisted in the browser's localStorage — no backend database or authentication required.
Server Actions in `src/server/actions/` handle server-side input validation and ID/timestamp
generation; a Route Handler at `app/api/categories/route.ts` serves the predefined category
list. Client Components hydrate from localStorage on mount and write back after receiving
validated data from Server Actions.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode, `moduleResolution: bundler`)
**Primary Dependencies**: Next.js 16.2.6, React 19.2, Tailwind CSS v4
**Storage**: Browser localStorage — key `expense-tracker:expenses`, serialized JSON array
**Testing**: Not configured; testing strategy to be agreed before production release (per constitution)
**Target Platform**: Modern web browser (Chrome 100+, Firefox 100+, Edge 100+)
**Project Type**: Web application — Next.js 16, App Router
**Performance Goals**:
- Dashboard loads ≤1 second with up to 10,000 stored expenses (SC-002)
- Add expense: open-to-confirm in under 30 seconds (SC-001)
- Filter/sort returns updated list instantly (SC-004)
- Delete: list and totals update within 1 second of confirmation (SC-005)

**Constraints**: No backend server, no auth, localStorage-only persistence, offline-capable,
description max 500 chars, single currency (USD)
**Scale/Scope**: Single user, single browser, up to 10,000 expense records

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — no new violations.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean & Modular Code | ✅ PASS | Storage, validation, Server Actions, hooks, and components each have a single responsibility in their own module. No mixed concerns. |
| II. Next.js 16 App Router First | ✅ PASS | App Router exclusively; no Pages Router; no webpack config; Turbopack is default. All async APIs will be `await`-ed per spec. |
| III. Server Components by Default | ✅ PASS (justified exception noted) | Page/layout shells are Server Components. `'use client'` boundary is at the data layer (Dashboard, form, list) because localStorage is a browser-only API unavailable in Server Components. This is the narrowest justified boundary — see Complexity Tracking. |
| IV. TypeScript Strict Mode | ✅ PASS | `strict: true` already in `tsconfig.json`; `any` is forbidden; all new files use `.ts`/`.tsx`. |
| V. Simplicity & YAGNI | ✅ PASS | No auth, no multi-currency, no import/export, predefined categories only. No external validation library — native TypeScript guards are sufficient. |

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-tracker-app/
├── plan.md              # This file (speckit-plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── server-actions.md   # Phase 1 output
│   ├── api-routes.md       # Phase 1 output
│   └── storage-schema.md   # Phase 1 output
└── tasks.md             # Phase 2 output (speckit-tasks — not created by speckit-plan)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                       # Root layout (Server Component)
├── page.tsx                         # Dashboard page shell (Server Component)
├── globals.css                      # Tailwind CSS v4 — @theme tokens, base styles
└── api/
    └── categories/
        └── route.ts                 # GET /api/categories (Route Handler)

src/
├── server/
│   ├── actions/
│   │   └── expenses.ts              # 'use server' — createExpense, deleteExpense
│   └── validation/
│       └── expense.ts               # Pure validation functions, no framework deps
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.tsx            # 'use client' — orchestrates all expense state
│   │   ├── ExpenseList.tsx          # Expense rows + column sort controls
│   │   ├── ExpenseSummary.tsx       # Total spent, count, per-category breakdown
│   │   └── ExpenseFilters.tsx       # Category select + date-range inputs
│   ├── expenses/
│   │   ├── ExpenseForm.tsx          # Add expense form (binds to createExpense action)
│   │   └── ExpenseItem.tsx          # Single expense row with delete trigger
│   └── ui/
│       └── ConfirmDialog.tsx        # Delete confirmation modal
├── hooks/
│   └── useExpenses.ts               # localStorage CRUD + filter/sort state management
├── lib/
│   ├── storage.ts                   # localStorage read/write/parse utilities
│   └── categories.ts                # EXPENSE_CATEGORIES constant (server + client safe)
└── types/
    └── expense.ts                   # Expense, ExpenseCategory, form state types
```

**Structure Decision**: Next.js App Router convention with `app/` for route segments and
layouts. Shared code lives in `src/` with a dedicated `src/server/` subtree for anything
that runs exclusively on the server (Server Actions, validation). This makes the
server/client boundary visible at the directory level without custom tooling.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| `'use client'` at Dashboard level (not just leaf nodes) | `useExpenses` hook reads and writes `localStorage`, which is a browser-only API unavailable in Server Components | Prop-drilling an entire mutable expense array from a Server Component is impossible without a server-side data store; making only leaf nodes Client Components would require threading state through Server Component boundaries, which is impossible |
