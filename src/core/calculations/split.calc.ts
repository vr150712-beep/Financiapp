import type { Profile } from '../schemas'

export interface SplitRatio {
  victorRatio: number
  partnerRatio: number
}

export function calcSplitRatio(victor: Profile, partner: Profile): SplitRatio {
  const victorIncome  = victor.sources.reduce((sum, s) => sum + s.amount, 0)
  const partnerIncome = partner.sources.reduce((sum, s) => sum + s.amount, 0)
  const total = victorIncome + partnerIncome

  if (total === 0) return { victorRatio: 0.5, partnerRatio: 0.5 }

  const victorRatio  = victorIncome / total
  const partnerRatio = 1 - victorRatio

  return { victorRatio, partnerRatio }
}

export function calcSuggestedPart(amount: number, ratio: number): number {
  return Math.round(amount * ratio)
}
