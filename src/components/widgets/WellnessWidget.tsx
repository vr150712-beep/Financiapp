import { Wallet } from 'lucide-react'
import { WellnessRing } from '@/components/ui/WellnessRing'
import { useWellness } from '@/hooks'
import { useExpensesStore } from '@/store'
import { formatCOP } from '@/lib/format'
import { CATEGORIES, CATEGORY_COLORS } from '@/core'
import type { ProfileId } from '@/core'

interface WellnessWidgetProps {
  profileId: ProfileId
  profileName: string
  onAddIncome: () => void
}

export function WellnessWidget({ profileId, profileName, onAddIncome }: WellnessWidgetProps) {
  const w = useWellness(profileId)
  const expenses = useExpensesStore((s) => s.expenses)

  const mine  = expenses.filter((e) => e.ownerId === profileId)
  const total = mine.reduce((sum, e) => sum + (e.shared ? e.myPart : e.amount), 0)

  const byCategory: Record<string, number> = {}
  for (const e of mine) {
    const v = e.shared ? e.myPart : e.amount
    byCategory[e.category] = (byCategory[e.category] ?? 0) + v
  }

  const segments = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([key, amount]) => ({
      key,
      label: CATEGORIES[key as keyof typeof CATEGORIES]?.label ?? key,
      pct: total > 0 ? (amount / total) * 100 : 0,
      // Alimentación's raw brand yellow-green is reserved for the wide bar segment only
      color: key === 'alimentacion' ? 'var(--cat-alimentacion-bar)' : (CATEGORY_COLORS[key] ?? 'var(--cat-otros)'),
    }))

  const topSegments = segments.slice(0, 3)
  const legendText = topSegments.map((s) => `${s.label} ${Math.round(s.pct)}%`).join(' · ')

  if (w.income === 0) {
    return (
      <div className="rounded-card relative overflow-hidden border border-dashed" style={{ background: 'var(--s1)', borderColor: 'rgba(75,127,250,0.35)' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-card" style={{ background: 'var(--blue)' }} />
        <div className="p-5 pt-6">
          <svg className="absolute right-4 top-8 opacity-[0.06]" width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--blue)" strokeWidth="8" />
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--blue)" strokeWidth="8"
              strokeDasharray="130" strokeDashoffset="40" strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--blue-dim)] flex items-center justify-center flex-shrink-0">
              <Wallet size={20} strokeWidth={1.5} className="text-[var(--blue-t)]" />
            </div>
            <div>
              <p className="text-sm-ui font-semibold text-[var(--t1)]">
                ¿Cuánto ganas al mes?
              </p>
              <p className="text-xs-ui text-[var(--t3)] mt-0.5">
                Configura tus ingresos para ver tu bienestar
              </p>
            </div>
          </div>

          <button
            onClick={onAddIncome}
            className="w-full py-2.5 bg-[var(--blue-dim)] text-[var(--blue-t)] rounded-xl text-sm-ui font-medium btn-press border"
            style={{ borderColor: 'rgba(75,127,250,0.2)' }}
          >
            + Añadir ingresos de {profileName}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-card relative overflow-hidden" style={{ background: 'var(--hero-bg)' }}>
      <div className="p-5 pt-5">
        <div className="mb-5">
          <p className="label" style={{ color: 'var(--hero-t2)' }}>BIENESTAR FINANCIERO</p>
        </div>

        <div className="flex items-center gap-5 mb-5">
          <WellnessRing
            pct={w.wellnessPct}
            status={w.status}
            size={88}
            strokeWidth={6}
            colorOverride="var(--blue)"
            trackColor="var(--hero-track)"
            centerColor="var(--hero-t1)"
          />

          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="num-xl truncate" style={{ color: 'var(--hero-t1)' }}>{formatCOP(w.remaining)}</p>
            <p className="text-xs-ui mt-1" style={{ color: 'var(--hero-t2)' }}>sin comprometer</p>
          </div>
        </div>

        <div className="h-px mb-4" style={{ background: 'var(--hero-divider)' }} />

        <div className="flex justify-between mb-4">
          <Stat label="Ingresos" value={formatCOP(w.income)} color="var(--victor)" />
          <Stat label="Gastos pers." value={formatCOP(w.personalBurden)} color="var(--hero-t1)" />
          <Stat label="Compartido" value={formatCOP(w.sharedBurden)} color="var(--blue)" />
        </div>

        <div className="h-px mb-3.5" style={{ background: 'var(--hero-divider)' }} />

        <div className="flex justify-between items-center mb-2">
          <span className="label" style={{ color: 'var(--hero-t2)' }}>DISTRIBUCIÓN</span>
          <span className="text-xs-ui" style={{ color: 'var(--hero-t2)' }}>
            {total > 0 ? legendText : 'Sin gastos este mes'}
          </span>
        </div>
        <div className="flex h-1.5 rounded-full overflow-hidden" style={total === 0 ? { opacity: 0.25 } : undefined}>
          {total > 0 ? (
            segments.map((s) => (
              <div key={s.key} className="h-full" style={{ width: `${s.pct}%`, background: s.color }} />
            ))
          ) : (
            <div className="h-full w-full" style={{ background: 'var(--hero-track)' }} />
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-xs-ui mb-1" style={{ color: 'var(--hero-t2)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>{label}</p>
      <p className="num-sm" style={{ color }}>{value}</p>
    </div>
  )
}
