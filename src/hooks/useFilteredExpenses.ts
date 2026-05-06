import { useMemo } from 'react'
import { useExpensesStore } from '@/store'
import type { Category, ProfileId } from '@/core'

export function useFilteredExpenses(profileId: ProfileId, category: Category | 'all') {
  const expenses = useExpensesStore((s) => s.expenses)

  return useMemo(() => {
    const mine = expenses.filter((e) => e.ownerId === profileId)
    if (category === 'all') return mine
    return mine.filter((e) => e.category === category)
  }, [expenses, profileId, category])
}
