import type { Expense, ProfileId } from '../schemas'

export interface EquityResult {
  victorBurden:  number
  partnerBurden: number
  totalShared:   number
  victorPct:     number
  partnerPct:    number
}

export function calcEquity(expenses: Expense[]): EquityResult {
  const shared = expenses.filter(e => e.shared)

  let victorBurden  = 0
  let partnerBurden = 0

  for (const e of shared) {
    if (e.ownerId === 'victor') {
      victorBurden  += e.myPart
      partnerBurden += e.otherPart
    } else {
      partnerBurden += e.myPart
      victorBurden  += e.otherPart
    }
  }

  const totalShared = victorBurden + partnerBurden
  const victorPct   = totalShared > 0 ? (victorBurden / totalShared) * 100 : 50
  const partnerPct  = 100 - victorPct

  return { victorBurden, partnerBurden, totalShared, victorPct, partnerPct }
}

export function calcProfileBurden(profileId: ProfileId, expenses: Expense[]): number {
  return expenses
    .filter(e => e.shared)
    .reduce((sum, e) => {
      if (e.ownerId === profileId) return sum + e.myPart
      return sum + e.otherPart
    }, 0)
}
