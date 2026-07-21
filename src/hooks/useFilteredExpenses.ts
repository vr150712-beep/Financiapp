import { useMemo } from 'react'
import { useExpensesStore } from '@/store'
import type { Category, ProfileId } from '@/core'

export function useFilteredExpenses(profileId: ProfileId, category: Category | 'all') {
  const expenses = useExpensesStore((s) => s.expenses)

  return useMemo(() => {
    const relevant = expenses.filter((e) => e.ownerId === profileId || e.shared)
    if (category === 'all') return relevant
    return relevant.filter((e) => e.category === category)
  }, [expenses, profileId, category])
}
