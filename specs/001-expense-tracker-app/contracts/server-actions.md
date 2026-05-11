# Contract: Server Actions

**File**: `src/server/actions/expenses.ts`
**Directive**: `'use server'` at file scope
**Branch**: `001-expense-tracker-app` | **Date**: 2026-05-11

---

## createExpense

Validates raw form input, generates a UUID and creation timestamp server-side, and returns
a complete `Expense` object ready for localStorage persistence.

### Signature

```typescript
export async function createExpense(
  formData: FormData
): Promise<CreateExpenseResult>
```

### Input — FormData fields

| Field | FormData key | Required |
|-------|-------------|----------|
| Amount | `amount` | Yes |
| Date | `date` | Yes |
| Category | `category` | Yes |
| Description | `description` | No (empty string treated as null) |

### Return Type

```typescript
export type CreateExpenseResult =
  | { success: true; expense: Expense }
  | { success: false; errors: Record<string, string> }
```

### Behaviour

1. Extract `amount`, `date`, `category`, `description` from `formData`.
2. Call `validateExpenseInput(input)` from `src/server/validation/expense.ts`.
3. On validation failure: return `{ success: false, errors }` where keys are field names.
4. On success:
   - Generate `id` via `crypto.randomUUID()`
   - Set `createdAt` to `new Date().toISOString()`
   - Return `{ success: true, expense }`

### Client-side post-action responsibility

After receiving `{ success: true, expense }`, the calling Client Component must:
1. Call `storage.addExpense(expense)` to write to localStorage.
2. Update local React state to include the new expense (prepend to list).

---

## deleteExpense

Validates that the provided ID is a well-formed UUID v4. Returns the validated ID for the
Client Component to remove from localStorage.

### Signature

```typescript
export async function deleteExpense(
  id: string
): Promise<DeleteExpenseResult>
```

### Return Type

```typescript
export type DeleteExpenseResult =
  | { success: true; id: string }
  | { success: false; error: string }
```

### Behaviour

1. Validate that `id` matches UUID v4 format (regex: `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`).
2. On invalid format: return `{ success: false, error: "Invalid expense ID" }`.
3. On valid: return `{ success: true, id }`.

### Client-side post-action responsibility

After receiving `{ success: true, id }`, the calling Client Component must:
1. Call `storage.removeExpense(id)` to remove from localStorage.
2. Update local React state to exclude the deleted expense.

---

## Supporting Types (defined in `src/types/expense.ts`)

```typescript
export type CreateExpenseResult =
  | { success: true; expense: Expense }
  | { success: false; errors: Record<string, string> }

export type DeleteExpenseResult =
  | { success: true; id: string }
  | { success: false; error: string }
```
