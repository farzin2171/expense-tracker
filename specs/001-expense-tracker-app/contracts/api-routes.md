# Contract: API Route Handlers

**Branch**: `001-expense-tracker-app` | **Date**: 2026-05-11

---

## GET /api/categories

Returns the complete list of predefined expense categories.

**File**: `app/api/categories/route.ts`

### Request

```
GET /api/categories
```

No query parameters, request headers, or request body required.

### Response

```
200 OK
Content-Type: application/json
```

```typescript
type CategoriesResponse = {
  categories: Array<{
    value: ExpenseCategory
    label: string
  }>
}
```

### Example Response Body

```json
{
  "categories": [
    { "value": "food-dining",   "label": "Food & Dining" },
    { "value": "transport",     "label": "Transport" },
    { "value": "housing",       "label": "Housing" },
    { "value": "health",        "label": "Health" },
    { "value": "entertainment", "label": "Entertainment" },
    { "value": "shopping",      "label": "Shopping" },
    { "value": "education",     "label": "Education" },
    { "value": "other",         "label": "Other" }
  ]
}
```

### Implementation Notes

- The route handler imports `EXPENSE_CATEGORIES` from `src/lib/categories.ts` and wraps
  it in the `{ categories }` envelope.
- The `app/page.tsx` Server Component fetches this endpoint during SSR and passes the
  `categories` array as a prop to `<Dashboard>`. No client-side fetch is needed.
- The response is static — no caching headers are required beyond Next.js defaults.
