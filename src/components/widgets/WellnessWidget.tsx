import { Wallet } from 'lucide-react'
import { WellnessRing } from '@/components/ui/WellnessRing'
import { useWellness } from '@/hooks'
import { useProfilesStore } from '@/store'
import { formatCOP } from '@/lib/format'
import type { ProfileId } from '@/core'

interface WellnessWidgetProps {
  profileId: ProfileId
  profileName: string
  onAddIncome: () => void
}

export function WellnessWidget({ profileId, profileName, onAddIncome }: WellnessWidgetProps) {
  const w            = useWellness(profileId)
  const profileColor = useProfilesStore((s) => s.profiles[profileId].color)

  if (w.income === 0) {
    return (
      <div className="rounded-card relative overflow-hidden border border-dashed border-[rgba(29,158,117,0.35)]"
        style={{ background: 'var(--s1)' }}
      >
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-card" style={{ background: 'var(--emerald)' }} />
        <div className="p-5 pt-6">
          {/* Ghost ring in background */}
          <svg className="absolute right-4 top-8 opacity-[0.06]" width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--emerald)" strokeWidth="8" />
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--emerald)" strokeWidth="8"
              strokeDasharray="130" strokeDashoffset="40" strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--emerald-dim)] flex items-center justify-center flex-shrink-0">
              <Wallet size={20} strokeWidth={1.5} className="text-[var(--emerald-t)]" />
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
            className="w-full py-2.5 bg-[var(--emerald-dim)] text-[var(--emerald-t)] rounded-xl text-sm-ui font-medium btn-press border border-[rgba(29,158,117,0.2)]"
          >
            + Añadir ingresos de {profileName}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-card relative overflow-hidden"
      style={{
        background: `color-mix(in srgb, ${profileColor} 7%, var(--s1))`,
      }}
    >
      {/* Accent strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-card" style={{ background: profileColor }} />

      <div className="p-4 pt-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <p className="label text-[var(--t3)]">BIENESTAR FINANCIERO</p>
          <span
            className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full"
            style={{ background: `${profileColor}22`, color: profileColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: profileColor }} />
            {profileName}
          </span>
        </div>

        {/* Content row: ring + stats */}
        <div className="flex items-start gap-4">
          {/* Ring */}
          <WellnessRing
            pct={w.wellnessPct}
            status={w.status}
            size={96}
            strokeWidth={7}
            colorOverride={profileColor}
          />

          {/* Stats */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="num-lg text-[var(--t1)] leading-none truncate">{formatCOP(w.remaining)}</p>
            <p className="text-xs-ui text-[var(--t3)] mt-1">sin comprometer</p>

            {/* Divider */}
            <div className="border-t border-[var(--s3)] my-2.5" />

            {/* Breakdown rows */}
            <div className="flex flex-col gap-1.5">
              <Row label="Ingresos"     value={formatCOP(w.income)}         color="var(--emerald-t)" />
              <Row label="Gastos pers." value={formatCOP(w.personalBurden)} color="var(--t2)" />
              <Row
                label="Compartido"
                value={formatCOP(w.sharedBurden)}
                color={profileColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center gap-1">
      <span className="text-xs-ui text-[var(--t3)] flex-shrink-0">{label}</span>
      <span className="num-sm flex-shrink-0" style={{ color }}>{value}</span>
    </div>
  )
}
