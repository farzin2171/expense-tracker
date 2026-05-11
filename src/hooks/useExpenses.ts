'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Expense, ExpenseCategory, FilterState, SortState } from '@/src/types/expense'
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
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState)
  const [sortState, setSortState] = useState<SortState>(defaultSortState)

  useEffect(() => {
    setExpenses(storage.loadExpenses())
  }, [])

  function addExpense(expense: Expense): void {
    storage.addExpense(expense)
    setExpenses((prev) => [expense, ...prev])
  }

  function setFilter(patch: Partial<FilterState>): void {
    setFilterState((prev) => ({ ...prev, ...patch }))
  }

  function setSort(sort: SortState): void {
    setSortState(sort)
  }

  const filteredExpenses = useMemo(() => {
    let result = expenses

    if (filterState.category !== 'all') {
      result = result.filter((e) => e.category === filterState.category)
    }
    if (filterState.dateFrom !== null) {
      result = result.filter((e) => e.date >= filterState.dateFrom!)
    }
    if (filterState.dateTo !== null) {
      result = result.filter((e) => e.date <= filterState.dateTo!)
    }

    result = [...result].sort((a, b) => {
      const aVal = sortState.column === 'date' ? a.date : a.amount
      const bVal = sortState.column === 'date' ? b.date : b.amount
      if (aVal < bVal) return sortState.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortState.direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [expenses, filterState, sortState])

  const summary = useMemo(() => {
    const byCategory = {} as Record<ExpenseCategory, number>
    let total = 0

    for (const expense of filteredExpenses) {
      total += expense.amount
      byCategory[expense.category] = (byCategory[expense.category] ?? 0) + expense.amount
    }

    return { total, count: filteredExpenses.length, byCategory }
  }, [filteredExpenses])

  return {
    expenses,
    addExpense,
    filterState,
    sortState,
    setFilter,
    setSort,
    filteredExpenses,
    summary,
  }
}
