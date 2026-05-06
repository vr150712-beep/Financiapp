import { Home } from 'lucide-react'
import { motion } from 'motion/react'
import { useExpensesStore, useProfilesStore } from '@/store'
import { formatCOP } from '@/lib/format'

export function HouseWidget() {
  const expenses = useExpensesStore((s) => s.expenses)
  const profiles = useProfilesStore((s) => s.profiles)

  const shared   = expenses.filter((e) => e.shared)
  const total    = shared.reduce((sum, e) => sum + e.amount, 0)
  const paid     = shared.reduce((sum, e) => sum + e.myPart + e.otherPart, 0)
  const pct      = total > 0 ? (paid / total) * 100 : 0

  if (shared.length === 0) return null

  return (
    <div className="bg-[var(--s1)] rounded-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-card bg-[var(--s2)] flex items-center justify-center">
            <Home size={16} strokeWidth={1.5} className="text-[var(--t2)]" />
          </div>
          <div>
            <p className="text-sm-ui text-[var(--t1)] font-medium">Hogar compartido</p>
            <p className="text-xs-ui text-[var(--t3)]">{shared.length} gasto{shared.length !== 1 ? 's' : ''} este mes</p>
          </div>
        </div>
        {/* Avatar pair */}
        <div className="flex -space-x-1">
          {(['victor', 'partner'] as const).map((id) => (
            <div
              key={id}
              className="w-6 h-6 rounded-full border-2 border-[var(--s1)] flex items-center justify-center text-white label"
              style={{ backgroundColor: profiles[id].color }}
            >
              {profiles[id].name[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[var(--s2)] rounded-pill overflow-hidden mb-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-[var(--blue)] rounded-pill"
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs-ui text-[var(--t3)]">{formatCOP(paid)} de {formatCOP(total)}</p>
        <p className="text-xs-ui text-[var(--blue-t)]">{Math.round(pct)}%</p>
      </div>
    </div>
  )
}
