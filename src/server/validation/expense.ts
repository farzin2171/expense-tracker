import type { Expense, ExpenseCategory, ExpenseFormInput, ValidationResult } from '@/src/types/expense'

const VALID_CATEGORIES: ExpenseCategory[] = [
  'food-dining',
  'transport',
  'housing',
  'health',
  'entertainment',
  'shopping',
  'education',
  'other',
]

export function validateExpenseInput(input: ExpenseFormInput): ValidationResult<Expense> {
  const errors: Record<string, string> = {}

  const parsedAmount = parseFloat(input.amount)
  if (!isFinite(parsedAmount)) {
    errors.amount = 'Amount must be a valid number'
  } else if (parsedAmount <= 0) {
    errors.amount = 'Amount must be greater than zero'
  }

  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date) || isNaN(Date.parse(input.date))) {
    errors.date = 'Date is required and must be a valid date'
  }

  if (!VALID_CATEGORIES.includes(input.category as ExpenseCategory)) {
    errors.category = 'Please select a valid category'
  }

  if (input.description !== null && input.description.length > 500) {
    errors.description = 'Description must be 500 characters or fewer'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      id: '',
      amount: Math.round(parsedAmount * 100) / 100,
      date: input.date,
      category: input.category as ExpenseCategory,
      description: input.description === '' ? null : input.description,
      createdAt: '',
    },
  }
}
