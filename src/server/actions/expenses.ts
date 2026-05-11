'use server'

import type { CreateExpenseResult, DeleteExpenseResult } from '@/src/types/expense'
import { validateExpenseInput } from '@/src/server/validation/expense'

export async function createExpense(formData: FormData): Promise<CreateExpenseResult> {
  const amount = (formData.get('amount') ?? '') as string
  const date = (formData.get('date') ?? '') as string
  const category = (formData.get('category') ?? '') as string
  const rawDescription = formData.get('description') as string | null
  const description = rawDescription === '' ? null : rawDescription

  const result = validateExpenseInput({ amount, date, category, description })

  if (!result.success) {
    return { success: false, errors: result.errors }
  }

  return {
    success: true,
    expense: {
      ...result.data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    },
  }
}

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function deleteExpense(id: string): Promise<DeleteExpenseResult> {
  if (!UUID_V4.test(id)) {
    return { success: false, error: 'Invalid expense ID' }
  }
  return { success: true, id }
}
