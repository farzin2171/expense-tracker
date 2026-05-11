'use client'

import { useState, useEffect } from 'react'
import type { Expense, FilterState, SortState } from '@/src/types/expense'
import * as storage from '@/src/lib/storage'

const defaultFilterState: FilterState = {
  category: 'all',
  dateFrom: null,
  dateTo: null,
}

const defaultSortState: SortState = {
  column: 'date',
  direction: 'desc',
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filterState] = useState<FilterState>(defaultFilterState)
  const [sortState] = useState<SortState>(defaultSortState)

  useEffect(() => {
    setExpenses(storage.loadExpenses())
  }, [])

  function addExpense(expense: Expense): void {
    storage.addExpense(expense)
    setExpenses((prev) => [expense, ...prev])
  }

  return { expenses, addExpense, filterState, sortState }
}
