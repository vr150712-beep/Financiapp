import { useMemo } from 'react'
import { useProfilesStore } from '@/store'
import { calcSplitRatio } from '@/core'

export function useSplitRatio() {
  const victor  = useProfilesStore((s) => s.profiles.victor)
  const partner = useProfilesStore((s) => s.profiles.partner)

  return useMemo(() => calcSplitRatio(victor, partner), [victor, partner])
}
