import type { Expense } from '@/src/types/expense'

const KEY = 'expense-tracker:expenses'

export function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Expense[]
  } catch {
    return []
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(KEY, JSON.stringify(expenses))
}

export function addExpense(expense: Expense): void {
  const existing = loadExpenses()
  saveExpenses([...existing, expense])
}

export function removeExpense(id: string): void {
  const existing = loadExpenses()
  saveExpenses(existing.filter((e) => e.id !== id))
}
