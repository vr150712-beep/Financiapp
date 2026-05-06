import { StackedBar, type BarSegment } from '@/components/ui/StackedBar'
import { useExpensesStore } from '@/store'
import { CATEGORIES } from '@/core'
import type { ProfileId } from '@/core'

export const CATEGORY_COLORS: Record<string, string> = {
  vivienda:        'var(--cat-vivienda)',
  alimentacion:    'var(--cat-alimentacion)',
  transporte:      'var(--cat-transporte)',
  salud:           'var(--cat-salud)',
  entretenimiento: 'var(--cat-entretenimiento)',
  suscripciones:   'var(--cat-suscripciones)',
  otros:           'var(--cat-otros)',
}

interface DistributionWidgetProps {
  profileId: ProfileId
}

export function DistributionWidget({ profileId }: DistributionWidgetProps) {
  const expenses = useExpensesStore((s) => s.expenses)

  const mine  = expenses.filter((e) => e.ownerId === profileId)
  const total = mine.reduce((sum, e) => sum + (e.shared ? e.myPart : e.amount), 0)

  if (total === 0) {
    return (
      <div className="bg-[var(--s1)] rounded-card p-4">
        <p className="label text-[var(--t3)] mb-3">DISTRIBUCIÓN DEL MES</p>
        {/* Ghost bar */}
        <div className="h-[11px] w-full rounded-full overflow-hidden flex gap-px opacity-20">
          <div className="bg-[var(--cat-vivienda)] h-full"        style={{ width: '38%' }} />
          <div className="bg-[var(--cat-alimentacion)] h-full"    style={{ width: '26%' }} />
          <div className="bg-[var(--cat-transporte)] h-full"      style={{ width: '20%' }} />
          <div className="bg-[var(--cat-entretenimiento)] h-full" style={{ width: '10%' }} />
          <div className="bg-[var(--cat-otros)] h-full"           style={{ width: '6%' }} />
        </div>
        <p className="text-xs-ui text-[var(--t3)] mt-3 text-center">
          Agrega gastos para ver cómo los distribuyes
        </p>
      </div>
    )
  }

  const byCategory: Record<string, number> = {}
  for (const e of mine) {
    const v = e.shared ? e.myPart : e.amount
    byCategory[e.category] = (byCategory[e.category] ?? 0) + v
  }

  const segments: BarSegment[] = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([key, amount]) => ({
      key,
      label: CATEGORIES[key as keyof typeof CATEGORIES]?.label ?? key,
      pct: (amount / total) * 100,
      color: CATEGORY_COLORS[key] ?? 'var(--cat-otros)',
    }))

  return (
    <div className="bg-[var(--s1)] rounded-card p-4">
      <p className="label text-[var(--t3)] mb-3">DISTRIBUCIÓN DEL MES</p>
      <StackedBar segments={segments} height={11} />
    </div>
  )
}
