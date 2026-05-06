import { Users } from 'lucide-react'
import { useExpensesStore, useProfilesStore } from '@/store'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { CATEGORIES } from '@/core'
import { formatCOP } from '@/lib/format'

export function SharedView() {
  const expenses = useExpensesStore((s) => s.expenses)
  const profiles = useProfilesStore((s) => s.profiles)
  const shared   = expenses.filter((e) => e.shared)

  if (shared.length === 0) {
    return (
      <div className="px-4 mt-8">
        <EmptyState
          icon={<Users size={28} />}
          title="Sin gastos compartidos"
          description="Cuando agregues gastos compartidos aparecerán aquí."
        />
      </div>
    )
  }

  const totalShared = shared.reduce((sum, e) => sum + e.amount, 0)
  const victorTotal = shared.reduce((sum, e) => {
    if (e.ownerId === 'victor') return sum + e.myPart
    return sum + e.otherPart
  }, 0)
  const partnerTotal = totalShared - victorTotal

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Summary card */}
      <div className="bg-[var(--s1)] rounded-card p-4">
        <p className="label text-[var(--t3)] mb-3">RESUMEN COMPARTIDO</p>
        <p className="num-xl text-[var(--t1)]">{formatCOP(totalShared)}</p>
        <p className="text-xs-ui text-[var(--t3)] mt-0.5">{shared.length} gastos este mes</p>
        <div className="flex gap-4 mt-3">
          <div>
            <p className="text-xs-ui text-[var(--blue-t)]">{profiles.victor.name}</p>
            <p className="num-md text-[var(--t1)]">{formatCOP(victorTotal)}</p>
          </div>
          <div>
            <p className="text-xs-ui text-[var(--pink-t)]">{profiles.partner.name}</p>
            <p className="num-md text-[var(--t1)]">{formatCOP(partnerTotal)}</p>
          </div>
        </div>
      </div>

      {/* Detail list */}
      <div className="flex flex-col gap-px">
        {shared.map((expense) => {
          const cat     = CATEGORIES[expense.category as keyof typeof CATEGORIES]
          const owner   = profiles[expense.ownerId]
          return (
            <div key={expense.id} className="flex items-center gap-3 py-3 border-b border-[var(--s3)]">
              <div className="w-9 h-9 rounded-card bg-[var(--s2)] flex items-center justify-center text-lg flex-shrink-0">
                {cat?.icon ?? '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm-ui text-[var(--t1)] truncate">{expense.label}</p>
                  <Badge variant="shared">⊕ compartido</Badge>
                </div>
                <p className="text-xs-ui text-[var(--t3)] mt-0.5">
                  {owner.name}: {formatCOP(expense.myPart)} · otro: {formatCOP(expense.otherPart)}
                </p>
              </div>
              <p className="num-md text-[var(--t1)] flex-shrink-0">{formatCOP(expense.amount)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
