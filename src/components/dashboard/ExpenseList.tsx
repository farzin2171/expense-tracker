'use client'

import type { Expense, SortState } from '@/src/types/expense'
import { ExpenseItem } from '@/src/components/expenses/ExpenseItem'

type Props = {
  expenses: Expense[]
  totalExpenses: number
  sortState: SortState
  setSort: (sort: SortState) => void
  onDelete?: (id: string) => void
}

function SortButton({
  label,
  column,
  sortState,
  setSort,
}: {
  label: string
  column: 'date' | 'amount'
  sortState: SortState
  setSort: (sort: SortState) => void
}) {
  const isActive = sortState.column === column
  const nextDirection = isActive && sortState.direction === 'asc' ? 'desc' : 'asc'
  const indicator = isActive ? (sortState.direction === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <button
      type="button"
      className={`sort-btn${isActive ? ' sort-btn-active' : ''}`}
      onClick={() => setSort({ column, direction: nextDirection })}
    >
      {label}{indicator}
    </button>
  )
}

export function ExpenseList({ expenses, totalExpenses, sortState, setSort, onDelete }: Props) {
  if (totalExpenses === 0) {
    return <p className="empty-state">Add your first expense above.</p>
  }

  if (expenses.length === 0) {
    return <p className="empty-state">No expenses match your filters.</p>
  }

  return (
    <div className="expense-list-wrapper">
      <div className="expense-list-controls">
        <span className="sort-label">Sort by:</span>
        <SortButton label="Date" column="date" sortState={sortState} setSort={setSort} />
        <SortButton label="Amount" column="amount" sortState={sortState} setSort={setSort} />
      </div>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  )
}
