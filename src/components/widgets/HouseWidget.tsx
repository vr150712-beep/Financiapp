import { Home } from 'lucide-react'
import { useExpensesStore, useProfilesStore } from '@/store'
import { useEquity } from '@/hooks'
import { formatCOP } from '@/lib/format'

export function HouseWidget() {
  const expenses = useExpensesStore((s) => s.expenses)
  const profiles = useProfilesStore((s) => s.profiles)
  const equity   = useEquity()

  const sharedCount = expenses.filter((e) => e.shared).length
  if (sharedCount === 0) return null

  const victorLeads = equity.victorPct >= equity.partnerPct
  const leadName  = victorLeads ? profiles.victor.name : profiles.partner.name
  const leadColor = victorLeads ? profiles.victor.color : profiles.partner.color
  const leadPct   = victorLeads ? equity.victorPct : equity.partnerPct

  return (
    <div className="flex items-center gap-3 bg-[var(--s1)] rounded-card p-3.5" style={{ boxShadow: 'var(--shadow-card)', border: 'var(--border)' }}>
      <div className="w-9 h-9 rounded-input bg-[var(--s2)] flex items-center justify-center flex-shrink-0">
        <Home size={17} strokeWidth={1.75} className="text-[var(--t2)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-sm-ui font-medium text-[var(--t1)]">Hogar compartido</span>
          <span className="text-sm-ui font-medium" style={{ color: leadColor }}>{leadName} {Math.round(leadPct)}%</span>
        </div>
        <div className="h-1 rounded-full bg-[var(--s2)] mb-1.5 flex overflow-hidden">
          <div className="h-full" style={{ width: `${equity.victorPct}%`, background: profiles.victor.color }} />
          <div className="h-full" style={{ width: `${equity.partnerPct}%`, background: profiles.partner.color }} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs-ui text-[var(--t2)]">
            {formatCOP(equity.totalShared)} · {sharedCount} gasto{sharedCount !== 1 ? 's' : ''}
          </span>
          <div className="flex">
            <div
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[9px] font-medium"
              style={{ backgroundColor: profiles.victor.color, border: '1.5px solid var(--s1)' }}
            >
              {profiles.victor.name[0]}
            </div>
            <div
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[9px] font-medium -ml-1.5"
              style={{ backgroundColor: profiles.partner.color, border: '1.5px solid var(--s1)' }}
            >
              {profiles.partner.name[0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
