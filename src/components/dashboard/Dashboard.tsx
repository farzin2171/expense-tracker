'use client'

import type { ExpenseCategory } from '@/src/types/expense'
import { useExpenses } from '@/src/hooks/useExpenses'
import { ExpenseForm } from '@/src/components/expenses/ExpenseForm'

type Props = {
  categories: Array<{ value: ExpenseCategory; label: string }>
}

export function Dashboard({ categories }: Props) {
  const { expenses, addExpense } = useExpenses()

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Expense Tracker</h1>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-form-section">
          <ExpenseForm categories={categories} onAdd={addExpense} />
        </section>

        <section className="dashboard-list-section">
          <h2 className="section-title">Expenses</h2>
          {expenses.length === 0 ? (
            <p className="empty-state">No expenses yet. Add your first expense above.</p>
          ) : (
            <ul className="expense-list">
              {expenses.map((expense) => (
                <li key={expense.id} className="expense-item-row">
                  <span className="expense-amount">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <span className="expense-date">{expense.date}</span>
                  <span className="expense-category">{expense.category}</span>
                  {expense.description && (
                    <span className="expense-description">{expense.description}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
