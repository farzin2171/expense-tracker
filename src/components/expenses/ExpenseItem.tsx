'use client'

import { useState } from 'react'
import type { Expense, ExpenseCategory } from '@/src/types/expense'
import { EXPENSE_CATEGORIES } from '@/src/lib/categories'
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog'

type Props = {
  expense: Expense
  onDelete?: (id: string) => void
}

function getCategoryLabel(category: ExpenseCategory): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export function ExpenseItem({ expense, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  const truncated =
    expense.description !== null && expense.description.length > 500
      ? expense.description.slice(0, 500)
      : expense.description

  return (
    <li className="expense-item">
      <span className="expense-item-amount">${expense.amount.toFixed(2)}</span>
      <span className="expense-item-date">{expense.date}</span>
      <span className="expense-item-category">{getCategoryLabel(expense.category)}</span>
      {truncated !== null && (
        <span className="expense-item-description" title={expense.description ?? undefined}>
          {truncated}
        </span>
      )}
      {onDelete && (
        <>
          <button
            type="button"
            className="expense-item-delete"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
          <ConfirmDialog
            isOpen={showConfirm}
            onConfirm={() => {
              setShowConfirm(false)
              onDelete(expense.id)
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </>
      )}
    </li>
  )
}
