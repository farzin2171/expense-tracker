'use client'

import type { ExpenseCategory } from '@/src/types/expense'
import { useExpenses } from '@/src/hooks/useExpenses'
import { ExpenseForm } from '@/src/components/expenses/ExpenseForm'
import { ExpenseFilters } from '@/src/components/dashboard/ExpenseFilters'
import { ExpenseSummary } from '@/src/components/dashboard/ExpenseSummary'
import { ExpenseList } from '@/src/components/dashboard/ExpenseList'

type Props = {
  categories: Array<{ value: ExpenseCategory; label: string }>
}

export function Dashboard({ categories }: Props) {
  const {
    expenses,
    addExpense,
    removeExpense,
    filterState,
    sortState,
    setFilter,
    setSort,
    filteredExpenses,
    summary,
  } = useExpenses()

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Expense Tracker</h1>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-form-section">
          <ExpenseForm categories={categories} onAdd={addExpense} />
        </section>

        <div className="dashboard-right-column">
          <section className="dashboard-filters-section">
            <ExpenseFilters filterState={filterState} setFilter={setFilter} />
          </section>

          <section className="dashboard-summary-section">
            <ExpenseSummary summary={summary} />
          </section>

          <section className="dashboard-list-section">
            <h2 className="section-title">Expenses</h2>
            <ExpenseList
              expenses={filteredExpenses}
              totalExpenses={expenses.length}
              sortState={sortState}
              setSort={setSort}
              onDelete={removeExpense}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
