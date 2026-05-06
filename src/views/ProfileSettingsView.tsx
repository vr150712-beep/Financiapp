import { ChevronRight, Pencil } from 'lucide-react'
import { useProfilesStore, selectProfileIncome } from '@/store'
import { formatCOP } from '@/lib/format'
import type { ProfileId } from '@/core'

interface ProfileSettingsViewProps {
  onEditProfile: () => void   // opens SettingsSheet
  onEditIncome: () => void    // opens IncomeSheet
}

export function ProfileSettingsView({ onEditProfile, onEditIncome }: ProfileSettingsViewProps) {
  const profiles = useProfilesStore((s) => s.profiles)

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">

      {/* Income / profile cards */}
      <section>
        <p className="label text-[var(--t3)] mb-2 mt-1">INGRESOS</p>
        <div className="flex flex-col gap-2">
          {(['victor', 'partner'] as ProfileId[]).map((id) => {
            const p      = profiles[id]
            const income = selectProfileIncome(p)
            return (
              <button
                key={id}
                onClick={onEditIncome}
                className="bg-[var(--s1)] rounded-card p-4 flex items-center gap-3 w-full text-left btn-press"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: p.color, fontSize: 15 }}
                >
                  {p.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm-ui font-semibold text-[var(--t1)]">{p.name}</p>
                  <p className="text-xs-ui text-[var(--t3)] mt-0.5">
                    {income > 0
                      ? `${formatCOP(income)}/mes · ${p.sources.length} fuente${p.sources.length !== 1 ? 's' : ''}`
                      : 'Sin ingresos configurados'}
                  </p>
                </div>

                <ChevronRight size={16} strokeWidth={1.5} className="text-[var(--t3)] flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </section>

      {/* App settings */}
      <section>
        <p className="label text-[var(--t3)] mb-2">PERSONALIZACIÓN</p>
        <div className="bg-[var(--s1)] rounded-card overflow-hidden">
          <button
            onClick={onEditProfile}
            className="w-full flex items-center justify-between px-4 py-3.5 btn-press"
          >
            <div className="flex items-center gap-3">
              <Pencil size={15} strokeWidth={1.5} className="text-[var(--t3)]" />
              <span className="text-sm-ui text-[var(--t1)]">Nombres y colores de perfil</span>
            </div>
            <ChevronRight size={15} strokeWidth={1.5} className="text-[var(--t3)]" />
          </button>
        </div>
      </section>

    </div>
  )
}
