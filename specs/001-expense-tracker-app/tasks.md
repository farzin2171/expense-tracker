# Tasks: Personal Expense Tracker

**Input**: Design documents from `/specs/001-expense-tracker-app/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No test tasks — testing strategy not yet configured (per constitution and plan.md).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared types and constants required by all user stories.

- [x] T001 Create all TypeScript types in `src/types/expense.ts` — `Expense`, `ExpenseCategory`, `ExpenseFormInput`, `ValidationResult<T>`, `FilterState`, `SortState`, `CreateExpenseResult`, `DeleteExpenseResult`
- [x] T002 [P] Create `EXPENSE_CATEGORIES` constant array in `src/lib/categories.ts` — 8 entries mapping `ExpenseCategory` values to display labels

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core storage, validation, and API infrastructure that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Implement localStorage utilities in `src/lib/storage.ts` — `loadExpenses`, `saveExpenses`, `addExpense`, `removeExpense` per storage-schema.md contract; include `typeof window === 'undefined'` guard
- [ ] T004 [P] Implement `validateExpenseInput(input: ExpenseFormInput): ValidationResult<Expense>` in `src/server/validation/expense.ts` — reject non-positive amounts, round to 2 d.p., validate `YYYY-MM-DD` date, validate category enum membership, enforce 500-char description limit per data-model.md validation rules
- [ ] T005 [P] Implement `GET /api/categories` Route Handler in `app/api/categories/route.ts` — imports `EXPENSE_CATEGORIES` from `src/lib/categories.ts`, returns `{ categories }` JSON per api-routes.md contract

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 — Add an Expense (Priority: P1) 🎯 MVP

**Goal**: A user opens the app, fills in the add-expense form, submits, and immediately sees the new expense in the list. Data persists across page refreshes.

**Independent Test**: Open the app, add a single expense with amount, date, category, and optional description. Verify the expense appears in the list and survives a full browser refresh (localStorage persisted).

- [ ] T006 [US1] Implement `createExpense(formData: FormData): Promise<CreateExpenseResult>` Server Action in `src/server/actions/expenses.ts` — `'use server'` at file scope, calls `validateExpenseInput`, generates `id` via `crypto.randomUUID()` and `createdAt` via `new Date().toISOString()`, returns `CreateExpenseResult` per server-actions.md contract
- [ ] T007 [US1] Implement `useExpenses` hook in `src/hooks/useExpenses.ts` — loads expenses from localStorage on mount (via `storage.loadExpenses`), exposes `expenses: Expense[]`, `addExpense(expense: Expense): void` (prepends to state + writes to localStorage), initial `filterState` and `sortState` defaults
- [ ] T008 [P] [US1] Build `ExpenseForm` component in `src/components/expenses/ExpenseForm.tsx` — `'use client'`, form fields for amount (text input), date (date input), category (select populated from `categories` prop), description (optional textarea); calls `createExpense` Server Action on submit; displays field-level error messages on `{ success: false }`; calls `onAdd(expense)` callback and resets form on `{ success: true }`
- [ ] T009 [US1] Build `Dashboard` Client Component skeleton in `src/components/dashboard/Dashboard.tsx` — `'use client'`, accepts `categories` prop, uses `useExpenses` hook, renders `<ExpenseForm>` (wired to `addExpense`) and a minimal expense list (one row per expense showing amount, date, category, description); shows empty-state message when `expenses.length === 0`
- [ ] T010 [US1] Update `app/page.tsx` (Server Component) to fetch categories from `/api/categories` during SSR and pass the result as `<Dashboard categories={categories} />`
- [ ] T011 [P] [US1] Add Tailwind CSS v4 design tokens and base styles to `app/globals.css` — colour palette (background, surface, primary, danger, muted), spacing scale, and font variables inside `@theme inline` block; remove any conflicting defaults

**Checkpoint**: User Story 1 complete — a user can add expenses and see them persist across page refreshes. App delivers value with only this story implemented.

---

## Phase 4: User Story 2 — View Expenses & Dashboard (Priority: P1)

**Goal**: A user sees expenses in reverse-chronological order with correct total/count/per-category summary statistics, and can filter by category or date range and sort by date or amount.

**Independent Test**: With at least three expenses in different categories and dates, open the app. Verify: (1) default order is date descending; (2) filtering by a category shows only that category's expenses and correct totals; (3) sorting by amount ascending reorders the list; (4) applying a date range filter narrows the list; (5) clearing filters restores all expenses.

- [ ] T012 [US2] Extend `useExpenses` in `src/hooks/useExpenses.ts` — add `filterState: FilterState`, `sortState: SortState`, `setFilter(patch: Partial<FilterState>): void`, `setSort(sort: SortState): void`; add memoized `filteredExpenses: Expense[]` (applies category and date-range filters then sort); add memoized `summary: { total: number; count: number; byCategory: Record<ExpenseCategory, number> }` derived from `filteredExpenses`
- [ ] T013 [P] [US2] Build `ExpenseItem` component in `src/components/expenses/ExpenseItem.tsx` — displays formatted amount (USD), date, category label, and description (truncated to 500 chars in list view with `title` attribute for full text on hover); accepts `onDelete?: (id: string) => void` prop (renders delete button only when provided, wired in Phase 5)
- [ ] T014 [P] [US2] Build `ExpenseList` component in `src/components/dashboard/ExpenseList.tsx` — renders `filteredExpenses` as `<ExpenseItem>` rows; column sort toggle buttons for date (asc/desc) and amount (asc/desc) that call `setSort`; empty-state message "No expenses match your filters" when list is empty but total expenses > 0; empty-state "Add your first expense above" when no expenses at all
- [ ] T015 [P] [US2] Build `ExpenseSummary` component in `src/components/dashboard/ExpenseSummary.tsx` — displays total amount spent (USD, 2 d.p.), total expense count, and per-category spending breakdown as a text list ("Food & Dining: $45.00 · Transport: $20.00"); all values derived from `summary` prop reflecting active filters
- [ ] T016 [P] [US2] Build `ExpenseFilters` component in `src/components/dashboard/ExpenseFilters.tsx` — category dropdown ("All" + each `EXPENSE_CATEGORIES` label), date-from date input, date-to date input; controlled by `filterState` prop; calls `setFilter` on change
- [ ] T017 [US2] Update `Dashboard.tsx` in `src/components/dashboard/Dashboard.tsx` to render the full layout: `<ExpenseFilters>`, `<ExpenseSummary>`, `<ExpenseList>` (replacing the Phase 3 minimal list), all wired to the filter/sort state from `useExpenses`

**Checkpoint**: User Story 2 complete — full dashboard with filtering, sorting, and summary statistics.

---

## Phase 5: User Story 3 — Delete an Expense (Priority: P2)

**Goal**: A user can delete any expense after a confirmation prompt; the list and totals update within 1 second of confirming.

**Independent Test**: Add two expenses. Click "Delete" on one and confirm — verify one remains and the total updates. Click "Delete" on the remaining expense and cancel — verify nothing changes.

- [ ] T018 [US3] Add `deleteExpense(id: string): Promise<DeleteExpenseResult>` Server Action to `src/server/actions/expenses.ts` — validates UUID v4 format via regex, returns `DeleteExpenseResult` per server-actions.md contract; extend `useExpenses` hook in `src/hooks/useExpenses.ts` with `removeExpense(id: string): Promise<void>` that calls the Server Action, on success calls `storage.removeExpense(id)` and removes the entry from state
- [ ] T019 [P] [US3] Build `ConfirmDialog` component in `src/components/ui/ConfirmDialog.tsx` — modal overlay, "Are you sure?" message, "Confirm" and "Cancel" buttons; traps focus while open; dismisses on Escape key; accepts `isOpen`, `onConfirm`, `onCancel` props
- [ ] T020 [US3] Wire delete into `ExpenseItem` in `src/components/expenses/ExpenseItem.tsx` — render a "Delete" button when `onDelete` prop is provided; show `<ConfirmDialog>` on click; call `onDelete(id)` on confirm, dismiss on cancel; update `Dashboard.tsx` to pass `onDelete={removeExpense}` down through `ExpenseList` to `ExpenseItem`

**Checkpoint**: User Story 3 complete — all three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Visual polish, edge-case verification, and production build validation.

- [ ] T021 [P] Verify all edge cases from spec.md are handled: zero/negative amount rejected with message (validation); description >500 chars truncated in list view with full text on hover (ExpenseItem); future dates accepted (no validation block); empty-state shown when all expenses deleted (ExpenseList)
- [ ] T022 [P] Review and refine responsive layout — update `app/globals.css` `@theme` tokens and component `className` values in `Dashboard.tsx`, `ExpenseForm.tsx`, `ExpenseList.tsx`, `ExpenseSummary.tsx`, `ExpenseFilters.tsx` for usability on narrow viewports (Tailwind CSS v4)
- [ ] T023 Run `npm run build` from the repo root and resolve any TypeScript type errors or ESLint violations across all source files
- [ ] T024 [P] Manually execute all quickstart.md validation flows (add expense, filter by category, filter by date range, sort by date, sort by amount, delete with confirm, delete with cancel, refresh and verify persistence) and fix any regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completing — BLOCKS all user stories
- **Phase 3 (US1 — Add Expense)**: Depends on Phase 2
- **Phase 4 (US2 — View Dashboard)**: Depends on Phase 3 (extends `useExpenses`, `Dashboard`, introduces `ExpenseItem`)
- **Phase 5 (US3 — Delete Expense)**: Depends on Phase 3 (extends `ExpenseItem`, `Dashboard`); can overlap with Phase 4
- **Phase 6 (Polish)**: Depends on Phases 3, 4, 5 all complete

### User Story Dependencies

- **US1 (P1)**: Requires Phase 2 complete. No inter-story dependencies.
- **US2 (P1)**: Builds on US1 — extends `useExpenses` (T012) and replaces the minimal list in `Dashboard` (T017).
- **US3 (P2)**: Builds on US1 — extends `ExpenseItem` (T020) and `Dashboard` (T020). Can be worked in parallel with US2 after US1 is complete.

### Within Each User Story

- Types (Phase 1) before everything else
- Storage/validation/API (Phase 2) before Server Actions and components
- Server Actions before components that call them
- Hook before components that consume it
- Leaf components before parent/orchestrating components
- Tasks marked [P] within a phase can run in parallel

### Parallel Opportunities

```
Phase 1:  T001 → T002 [P]
Phase 2:  T003 → T004 [P], T005 [P]
Phase 3:  T006 → T007 → T008 [P] (with T007 done), T009 (after T007) → T010; T011 [P] after T001
Phase 4:  T012 → T013 [P], T014 [P], T015 [P], T016 [P] (after T012) → T017
Phase 5:  T018 → T019 [P] → T020
Phase 6:  T021 [P], T022 [P] → T023 → T024 [P]
```

---

## Parallel Example: User Story 1

```bash
# After T007 (useExpenses) is done, launch in parallel:
Task T008: "Build ExpenseForm in src/components/expenses/ExpenseForm.tsx"

# After T007 is done, start sequentially:
Task T009: "Build Dashboard skeleton in src/components/dashboard/Dashboard.tsx"
Task T010: "Update app/page.tsx"

# Anytime after T001:
Task T011: "Add design tokens to app/globals.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002) — ~2 tasks
2. Complete Phase 2: Foundational (T003–T005) — ~3 tasks
3. Complete Phase 3: User Story 1 (T006–T011) — ~6 tasks
4. **STOP and VALIDATE**: Add an expense, refresh the browser, verify it persists.
5. Deploy or demo if ready.

### Incremental Delivery

1. Phase 1 + 2 → Foundation (5 tasks)
2. Phase 3 → MVP: add + basic view → validate → demo (6 tasks)
3. Phase 4 → Full dashboard with filters, sort, summary → validate (6 tasks)
4. Phase 5 → Delete with confirmation → validate (3 tasks)
5. Phase 6 → Polish and production build (4 tasks)

Each phase adds value without breaking previous phases.

---

## Notes

- [P] tasks operate on different files with no shared in-flight dependencies — process them in parallel.
- [Story] labels trace each task to a specific user story for delivery and testing traceability.
- No test tasks are included — no test runner is configured (see plan.md and constitution).
- Each user story phase ends with an independently testable checkpoint.
- Run `npm run build` only in Phase 6 (T023); earlier phases are iterative work-in-progress.
