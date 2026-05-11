'use client'

import { useRef, useState, useTransition } from 'react'
import type { Expense, ExpenseCategory } from '@/src/types/expense'
import { createExpense } from '@/src/server/actions/expenses'

type Props = {
  categories: Array<{ value: ExpenseCategory; label: string }>
  onAdd: (expense: Expense) => void
}

export function ExpenseForm({ categories, onAdd }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await createExpense(formData)
      if (!result.success) {
        setErrors(result.errors)
        return
      }
      setErrors({})
      onAdd(result.expense)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="expense-form">
      <h2 className="form-title">Add Expense</h2>

      <div className="form-field">
        <label htmlFor="amount" className="field-label">Amount (USD)</label>
        <input
          id="amount"
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          className={`field-input${errors.amount ? ' field-input--error' : ''}`}
          aria-describedby={errors.amount ? 'amount-error' : undefined}
        />
        {errors.amount && (
          <p id="amount-error" className="field-error" role="alert">{errors.amount}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="date" className="field-label">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          className={`field-input${errors.date ? ' field-input--error' : ''}`}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
        {errors.date && (
          <p id="date-error" className="field-error" role="alert">{errors.date}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="category" className="field-label">Category</label>
        <select
          id="category"
          name="category"
          defaultValue=""
          className={`field-input${errors.category ? ' field-input--error' : ''}`}
          aria-describedby={errors.category ? 'category-error' : undefined}
        >
          <option value="" disabled>Select a category</option>
          {categories.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.category && (
          <p id="category-error" className="field-error" role="alert">{errors.category}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="description" className="field-label">
          Description <span className="field-label--optional">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          placeholder="What was this expense for?"
          className={`field-input${errors.description ? ' field-input--error' : ''}`}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="field-error" role="alert">{errors.description}</p>
        )}
      </div>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? 'Adding…' : 'Add Expense'}
      </button>
    </form>
  )
}
