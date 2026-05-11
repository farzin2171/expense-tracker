import type { ExpenseCategory } from '@/src/types/expense'

export const EXPENSE_CATEGORIES: Array<{ value: ExpenseCategory; label: string }> = [
  { value: 'food-dining',   label: 'Food & Dining' },
  { value: 'transport',     label: 'Transport' },
  { value: 'housing',       label: 'Housing' },
  { value: 'health',        label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping',      label: 'Shopping' },
  { value: 'education',     label: 'Education' },
  { value: 'other',         label: 'Other' },
]
