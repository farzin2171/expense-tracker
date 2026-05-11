# Quickstart: Personal Expense Tracker

**Branch**: `001-expense-tracker-app` | **Date**: 2026-05-11

## Running the App

```bash
npm run dev    # start dev server at http://localhost:3000 (Turbopack)
npm run build  # production build
npm run start  # serve production build
npm run lint   # run ESLint
```

After adding, renaming, or removing routes: `npx next typegen` to regenerate type helpers.

---

## Architecture Overview

```
Browser
  │
  ├── Server Component  (app/page.tsx)
  │     └── fetches GET /api/categories during SSR
  │     └── renders <Dashboard categories={categories} />
  │
  ├── Client Component  (src/components/dashboard/Dashboard.tsx)
  │     └── useExpenses() hook  ← reads/writes localStorage on mount
  │     └── <ExpenseForm>       ← calls createExpense Server Action
  │     └── <ExpenseFilters>    ← filter state (category, date range)
  │     └── <ExpenseList>       ← sorted + filtered expense rows
  │     └── <ExpenseSummary>    ← total spent, count, per-category
  │
  └── localStorage['expense-tracker:expenses']  ← all data lives here
```

The key design constraint: localStorage is browser-only. Server Components cannot read it,
so the `'use client'` boundary sits at `Dashboard`. The page shell (`app/page.tsx`) remains
a Server Component that delivers categories via SSR.

---

## Request Flow: Add Expense

1. User fills in `<ExpenseForm>` and submits.
2. Form calls `createExpense(formData)` Server Action (`src/server/actions/expenses.ts`).
3. Server Action validates input, generates UUID + UTC timestamp, returns
   `{ success: true, expense }`.
4. On success, `<ExpenseForm>` calls `addExpense(expense)` (from `src/lib/storage.ts`)
   then updates the `useExpenses` hook state.
5. React re-renders — the new expense appears at the top of the list (date desc).

On validation failure, `createExpense` returns `{ success: false, errors }` and the form
displays inline error messages without navigating away.

---

## Request Flow: Delete Expense

1. User clicks "Delete" on an `<ExpenseItem>`.
2. `<ConfirmDialog>` is shown. User confirms.
3. `deleteExpense(id)` Server Action validates UUID format and returns `{ success: true, id }`.
4. `<Dashboard>` calls `removeExpense(id)` (from `src/lib/storage.ts`) then updates state.
5. React re-renders — expense disappears; summary totals update.

---

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Dashboard page shell (Server Component); fetches categories |
| `app/api/categories/route.ts` | Route Handler — returns predefined category list |
| `src/server/actions/expenses.ts` | Server Actions — `createExpense`, `deleteExpense` |
| `src/server/validation/expense.ts` | Validation logic — pure functions, no framework deps |
| `src/hooks/useExpenses.ts` | localStorage CRUD + filter/sort state |
| `src/lib/storage.ts` | localStorage read/write/parse utilities |
| `src/lib/categories.ts` | `EXPENSE_CATEGORIES` constant |
| `src/types/expense.ts` | All TypeScript types |
| `src/components/dashboard/Dashboard.tsx` | Root Client Component — owns expense state |

---

## Predefined Categories

| Value | Label |
|-------|-------|
| `food-dining` | Food & Dining |
| `transport` | Transport |
| `housing` | Housing |
| `health` | Health |
| `entertainment` | Entertainment |
| `shopping` | Shopping |
| `education` | Education |
| `other` | Other |

Categories are defined in `src/lib/categories.ts`. To add a category, update that file
and update the `ExpenseCategory` type in `src/types/expense.ts`.

---

## localStorage Notes

- **Key**: `expense-tracker:expenses`
- **Survives**: browser close, tab close, page refresh
- **Reset all data**: run `localStorage.removeItem('expense-tracker:expenses')` in the
  browser DevTools console
- **Max safe size**: ~5 MB in most browsers; 10,000 records ≈ 2 MB
- **Corruption handling**: if the stored value cannot be parsed, the app treats it as empty
  and starts fresh (no crash)
