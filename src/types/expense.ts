export type ExpenseCategory =
  | 'food-dining'
  | 'transport'
  | 'housing'
  | 'health'
  | 'entertainment'
  | 'shopping'
  | 'education'
  | 'other'

export type Expense = {
  id: string
  amount: number
  date: string
  category: ExpenseCategory
  description: string | null
  createdAt: string
}

export type ExpenseFormInput = {
  amount: string
  date: string
  category: string
  description: string | null
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

export type FilterState = {
  category: ExpenseCategory | 'all'
  dateFrom: string | null
  dateTo: string | null
}

export type SortState = {
  column: 'date' | 'amount'
  direction: 'asc' | 'desc'
}

export type CreateExpenseResult =
  | { success: true; expense: Expense }
  | { success: false; errors: Record<string, string> }

export type DeleteExpenseResult =
  | { success: true; id: string }
  | { success: false; error: string }
