# Data Model: Personal Expense Tracker

**Branch**: `001-expense-tracker-app` | **Date**: 2026-05-11

## Entity: Expense

Primary entity representing a single recorded expense.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | `string` (UUID v4) | Required; immutable; unique | Generated server-side via `crypto.randomUUID()` in `createExpense` Server Action |
| `amount` | `number` | Required; positive; max 2 decimal places | Stored as a JS number normalized to 2dp at validation |
| `date` | `string` | Required; format `YYYY-MM-DD` | Calendar date; future dates allowed (users may pre-log planned expenses) |
| `category` | `ExpenseCategory` | Required; one of the predefined values | See ExpenseCategory below |
| `description` | `string \| null` | Optional; max 500 characters | Free text; `null` when not provided or empty |
| `createdAt` | `string` | Required; immutable | UTC ISO 8601 timestamp generated server-side at creation |

### TypeScript Definition

```typescript
// src/types/expense.ts
export type Expense = {
  id: string
  amount: number
  date: string
  category: ExpenseCategory
  description: string | null
  createdAt: string
}
```

---

## Entity: ExpenseCategory (Enum)

Predefined set of expense categories. Not user-editable in this version (per spec Assumptions).

| Value | Display Label |
|-------|--------------|
| `food-dining` | Food & Dining |
| `transport` | Transport |
| `housing` | Housing |
| `health` | Health |
| `entertainment` | Entertainment |
| `shopping` | Shopping |
| `education` | Education |
| `other` | Other |

### TypeScript Definition

```typescript
// src/types/expense.ts
export type ExpenseCategory =
  | 'food-dining'
  | 'transport'
  | 'housing'
  | 'health'
  | 'entertainment'
  | 'shopping'
  | 'education'
  | 'other'

// src/lib/categories.ts
export const EXPENSE_CATEGORIES: Array<{ value: ExpenseCategory; label: string }> = [
  { value: 'food-dining',    label: 'Food & Dining' },
  { value: 'transport',      label: 'Transport' },
  { value: 'housing',        label: 'Housing' },
  { value: 'health',         label: 'Health' },
  { value: 'entertainment',  label: 'Entertainment' },
  { value: 'shopping',       label: 'Shopping' },
  { value: 'education',      label: 'Education' },
  { value: 'other',          label: 'Other' },
]
```

---

## Entity: ExpenseFormInput

Unvalidated raw input from the Add Expense form before Server Action processing.

| Field | Type | Notes |
|-------|------|-------|
| `amount` | `string` | Raw string from a text input field |
| `date` | `string` | Raw string from a date input field |
| `category` | `string` | Raw string from a select field |
| `description` | `string \| null` | Raw string or null if the field is empty/omitted |

### TypeScript Definition

```typescript
// src/types/expense.ts
export type ExpenseFormInput = {
  amount: string
  date: string
  category: string
  description: string | null
}
```

---

## Entity: ValidationResult

Generic return type from the validation layer in `src/server/validation/expense.ts`.

```typescript
// src/types/expense.ts
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }
```

---

## Entity: FilterState

Tracks the active filter criteria applied to the expense list.

```typescript
// src/types/expense.ts
export type FilterState = {
  category: ExpenseCategory | 'all'
  dateFrom: string | null  // YYYY-MM-DD or null (no lower bound)
  dateTo: string | null    // YYYY-MM-DD or null (no upper bound)
}
```

**Default**: `{ category: 'all', dateFrom: null, dateTo: null }` (no active filters)

---

## Entity: SortState

Tracks the active sort configuration for the expense list.

```typescript
// src/types/expense.ts
export type SortState = {
  column: 'date' | 'amount'
  direction: 'asc' | 'desc'
}
```

**Default**: `{ column: 'date', direction: 'desc' }` (reverse-chronological, per FR-003)

---

## Validation Rules

Implemented in `src/server/validation/expense.ts`. Applied inside `createExpense` Server Action.

| Field | Rule | Error Message |
|-------|------|--------------|
| `amount` | Must parse as a finite number | `"Amount must be a valid number"` |
| `amount` | Must be greater than 0 | `"Amount must be greater than zero"` |
| `amount` | Silently rounded to 2 decimal places | — (no error; normalization only) |
| `date` | Must be a valid `YYYY-MM-DD` date string | `"Date is required and must be a valid date"` |
| `category` | Must be one of the `ExpenseCategory` values | `"Please select a valid category"` |
| `description` | If non-null and non-empty, must be ≤500 characters | `"Description must be 500 characters or fewer"` |

---

## State Transitions

Expense lifecycle is simple — no multi-step state:

```
[created via Server Action] ──── deleteExpense(id) ──── [removed from localStorage]
```

There is no edit/update state in this version (per spec Assumptions: users delete and re-add).

---

## localStorage Representation

Expenses are serialized as a JSON array under key `expense-tracker:expenses`.

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 45.50,
    "date": "2026-05-11",
    "category": "food-dining",
    "description": "Team lunch",
    "createdAt": "2026-05-11T14:32:00.000Z"
  }
]
```
