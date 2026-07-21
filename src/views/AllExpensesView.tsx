import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { ReceiptText } from 'lucide-react'
import { useExpensesStore, useProfilesStore } from '@/store'
import { EmptyState } from '@/components/ui/EmptyState'
import { CATEGORIES } from '@/core'
import { CATEGORY_COLORS } from '@/core'
import { formatCOP } from '@/lib/format'
import type { Expense } from '@/core'

type Filter = 'all' | 'victor' | 'partner' | 'shared'

interface AllExpensesViewProps {
  onEdit: (expense: Expense) => void
}

export function AllExpensesView({ onEdit }: AllExpensesViewProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const allExpenses = useExpensesStore((s) => s.expenses)
  const remove      = useExpensesStore((s) => s.removeExpense)
  const restore     = useExpensesStore((s) => s.restoreExpense)
  const profiles    = useProfilesStore((s) => s.profiles)

  const filtered = allExpenses.filter((e) => {
    if (filter === 'all')     return true
    if (filter === 'shared')  return e.shared
    return e.ownerId === filter && !e.shared
  })

  function handleDelete(expense: Expense) {
    remove(expense.id)
    toast('Gasto eliminado', {
      action: { label: 'Deshacer', onClick: () => restore(expense) },
      duration: 5000,
    })
  }

  const filters: { id: Filter; label: string; color?: string }[] = [
    { id: 'all',     label: 'Todos' },
    { id: 'victor',  label: profiles.victor.name,  color: profiles.victor.color },
    { id: 'partner', label: profiles.partner.name, color: profiles.partner.color },
    { id: 'shared',  label: 'Compartido' },
  ]

  return (
    <div className="flex flex-col pb-4">
      {/* Filter pills */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-2 pt-1">
        {filters.map(({ id, label, color }) => {
          const isActive = filter === id
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs-ui font-medium btn-press transition-colors"
              style={
                isActive
                  ? { background: color ?? 'var(--blue)', color: '#fff' }
                  : { background: 'var(--s2)', color: 'var(--t2)' }
              }
            >
              {color && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              )}
              {label}
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="px-4 mt-8">
          <EmptyState
            icon={<ReceiptText size={28} />}
            title="Sin gastos aquí"
            description="Toca + para registrar un gasto."
          />
        </div>
      ) : (
        <div className="flex flex-col px-4 mt-2">
          <AnimatePresence initial={false}>
            {filtered.map((expense, i) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              >
                <ExpenseRow
                  expense={expense}
                  ownerName={profiles[expense.ownerId].name}
                  ownerColor={profiles[expense.ownerId].color}
                  onEdit={() => onEdit(expense)}
                  onDelete={() => handleDelete(expense)}
                  isLast={i === filtered.length - 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function ExpenseRow({ expense, ownerName, ownerColor, onEdit, onDelete, isLast }: {
  expense: Expense
  ownerName: string
  ownerColor: string
  onEdit: () => void
  onDelete: () => void
  isLast: boolean
}) {
  const cat      = CATEGORIES[expense.category as keyof typeof CATEGORIES]
  const catColor = CATEGORY_COLORS[expense.category] ?? 'var(--cat-otros)'
  const initial  = (cat?.label ?? expense.category).charAt(0).toUpperCase()

  return (
    <div className={`flex items-center gap-3 py-3.5 ${!isLast ? 'border-b border-[var(--s3)]' : ''}`}>
      {/* Category dot */}
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 self-center" style={{ background: catColor }} />

      {/* Icon box */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ background: 'var(--s2)', color: catColor }}
      >
        {initial}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm-ui text-[var(--t1)] truncate leading-tight">{expense.label}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {/* Owner badge */}
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: ownerColor + '22', color: ownerColor }}
          >
            {ownerName}
          </span>
          {expense.shared && (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: 'var(--blue-dim)', color: 'var(--blue-t)' }}
            >
              compartido
            </span>
          )}
        </div>
      </div>

      {/* Amount + actions */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <p className="num-md text-[var(--t1)]">{formatCOP(expense.amount)}</p>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onEdit}
            className="text-[var(--t3)] hover:text-[var(--t1)] transition-colors p-1.5 rounded-lg hover:bg-[var(--s2)] btn-press"
            aria-label="Editar"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-[var(--t3)] hover:text-[var(--coral-t)] transition-colors p-1.5 rounded-lg hover:bg-[var(--coral-dim)] btn-press"
            aria-label="Eliminar"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
