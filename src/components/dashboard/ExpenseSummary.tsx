'use client'

import type { ExpenseCategory } from '@/src/types/expense'
import { EXPENSE_CATEGORIES } from '@/src/lib/categories'

type Summary = {
  total: number
  count: number
  byCategory: Record<ExpenseCategory, number>
}

type Props = {
  summary: Summary
}

export function ExpenseSummary({ summary }: Props) {
  const categoryEntries = EXPENSE_CATEGORIES.filter(
    (c) => (summary.byCategory[c.value] ?? 0) > 0,
  )

  return (
    <div className="expense-summary">
      <div className="summary-totals">
        <span className="summary-total">
          Total: <strong>${summary.total.toFixed(2)}</strong>
        </span>
        <span className="summary-count">
          {summary.count} {summary.count === 1 ? 'expense' : 'expenses'}
        </span>
      </div>
      {categoryEntries.length > 0 && (
        <p className="summary-by-category">
          {categoryEntries
            .map((c) => `${c.label}: $${(summary.byCategory[c.value] ?? 0).toFixed(2)}`)
            .join(' · ')}
        </p>
      )}
    </div>
  )
}
