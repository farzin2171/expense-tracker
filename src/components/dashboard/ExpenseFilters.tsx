'use client'

import type { ExpenseCategory, FilterState } from '@/src/types/expense'
import { EXPENSE_CATEGORIES } from '@/src/lib/categories'

type Props = {
  filterState: FilterState
  setFilter: (patch: Partial<FilterState>) => void
}

export function ExpenseFilters({ filterState, setFilter }: Props) {
  return (
    <div className="expense-filters">
      <label className="filter-label">
        Category
        <select
          className="filter-select"
          value={filterState.category}
          onChange={(e) =>
            setFilter({ category: e.target.value as ExpenseCategory | 'all' })
          }
        >
          <option value="all">All</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-label">
        From
        <input
          type="date"
          className="filter-input"
          value={filterState.dateFrom ?? ''}
          onChange={(e) =>
            setFilter({ dateFrom: e.target.value || null })
          }
        />
      </label>

      <label className="filter-label">
        To
        <input
          type="date"
          className="filter-input"
          value={filterState.dateTo ?? ''}
          onChange={(e) =>
            setFilter({ dateTo: e.target.value || null })
          }
        />
      </label>
    </div>
  )
}
