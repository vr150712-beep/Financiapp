import { useMemo } from 'react'
import { useProfilesStore, useExpensesStore, selectProfileIncome } from '@/store'
import { calcWellness } from '@/core'
import type { ProfileId } from '@/core'

export function useWellness(profileId: ProfileId) {
  const profile  = useProfilesStore((s) => s.profiles[profileId])
  const expenses = useExpensesStore((s) => s.expenses)

  return useMemo(() => {
    const income = selectProfileIncome(profile)
    return calcWellness(profileId, income, expenses, profile.savings)
  }, [profile, expenses, profileId])
}
