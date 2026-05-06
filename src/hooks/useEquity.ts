import { useMemo } from 'react'
import { useExpensesStore } from '@/store'
import { calcEquity } from '@/core'

export function useEquity() {
  const expenses = useExpensesStore((s) => s.expenses)
  return useMemo(() => calcEquity(expenses), [expenses])
}
