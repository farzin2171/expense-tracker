# Contract: localStorage Schema

**Branch**: `001-expense-tracker-app` | **Date**: 2026-05-11

---

## Key: `expense-tracker:expenses`

Stores the complete, ordered array of expense records for the current user.

**Type**: JSON-serialized `Expense[]`
**Max practical size**: ~2 MB at 10,000 records × ~200 bytes per record
**Encoding**: UTF-8 JSON via `JSON.stringify` / `JSON.parse`
**Managed by**: `src/lib/storage.ts`

---

### Schema

```typescript
// localStorage.getItem('expense-tracker:expenses')
// → JSON.parse(value)
// → Expense[]
type StoredExpenses = Expense[]
```

Array order is insertion order. Sorting is applied at read time by `useExpenses`, never
at write time. This means the raw localStorage value is always in creation order
(oldest-first after the first item), making it easy to restore default sort without
re-sorting the stored array.

---

### Read Pattern

```typescript
// src/lib/storage.ts
export function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('expense-tracker:expenses')
  if (!raw) return []
  try {
    return JSON.parse(raw) as Expense[]
  } catch {
    return []
  }
}
```

---

### Write Patterns

```typescript
// src/lib/storage.ts

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem('expense-tracker:expenses', JSON.stringify(expenses))
}

export function addExpense(expense: Expense): void {
  const existing = loadExpenses()
  saveExpenses([...existing, expense])
}

export function removeExpense(id: string): void {
  const existing = loadExpenses()
  saveExpenses(existing.filter((e) => e.id !== id))
}
```

---

### Invariants

- The key is always absent (fresh install) or a valid JSON array. It is never a non-array
  or non-JSON value.
- A missing key is treated as an empty array.
- `JSON.parse` errors (corrupted data) are silently caught and treated as an empty array.
- Each `Expense.id` is a UUID v4 generated server-side; duplicates are prevented by the
  collision-negligible properties of UUID v4.
- `typeof window === 'undefined'` guard ensures storage utilities are safe to import in
  Server Component files without throwing at module load time.
