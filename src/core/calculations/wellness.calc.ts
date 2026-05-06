import type { Expense } from '../schemas'
import type { ProfileId } from '../schemas'

export type WellnessStatus = 'ok' | 'warning' | 'critical'

export interface WellnessResult {
  income:        number
  personalBurden:number
  sharedBurden:  number
  totalBurden:   number
  remaining:     number
  wellnessPct:   number
  savingsGap:    number
  status:        WellnessStatus
}

export function calcWellness(
  profileId: ProfileId,
  income: number,
  expenses: Expense[],
  targetSavings: number,
): WellnessResult {
  const mine = expenses.filter(e => e.ownerId === profileId)

  const personalBurden = mine
    .filter(e => !e.shared)
    .reduce((sum, e) => sum + e.amount, 0)

  const sharedBurden = mine
    .filter(e => e.shared)
    .reduce((sum, e) => sum + e.myPart, 0)

  const totalBurden = personalBurden + sharedBurden
  const remaining   = income - totalBurden
  const wellnessPct = income > 0 ? (remaining / income) * 100 : 0
  const savingsGap  = remaining - targetSavings

  let status: WellnessStatus = 'ok'
  if (wellnessPct < 20) status = 'critical'
  else if (wellnessPct < 40) status = 'warning'

  return {
    income,
    personalBurden,
    sharedBurden,
    totalBurden,
    remaining,
    wellnessPct,
    savingsGap,
    status,
  }
}
