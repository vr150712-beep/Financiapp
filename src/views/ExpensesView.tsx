import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { ShoppingBag } from 'lucide-react'
import { useExpensesStore } from '@/store'
import { EmptyState } from '@/components/ui/EmptyState'
import { CATEGORIES, type Category } from '@/core'
import { formatCOP } from '@/lib/format'
import { CATEGORY_COLORS } from '@/components/widgets/DistributionWidget'
import type { Expense, ProfileId } from '@/core'

const ALL = 'all'
type Filter = Category | typeof ALL

interface ExpensesViewProps {
  profileId: ProfileId
  onEdit: (expense: Expense) => void
}

export function ExpensesView({ profileId, onEdit }: ExpensesViewProps) {
  const [filter, setFilter] = useState<Filter>(ALL)

  const allExpenses = useExpensesStore((s) => s.expenses)
  const remove      = useExpensesStore((s) => s.removeExpense)
  const restore     = useExpensesStore((s) => s.restoreExpense)

  const mine     = allExpenses.filter((e) => e.ownerId === profileId)
  const filtered = filter === ALL ? mine : mine.filter((e) => e.category === filter)

  function handleDelete(expense: Expense) {
    remove(expense.id)
    toast('Gasto eliminado', {
      action: { label: 'Deshacer', onClick: () => restore(expense) },
      duration: 5000,
    })
  }

  return (
    <div className="flex flex-col pb-4">
      {/* Category filter chips */}
      <div className="flex gap-2 px-4 overflow-x-auto snap-x pb-2 pt-1" style={{ scrollPaddingLeft: '1rem' }}>
        <Chip label="Todas" active={filter === ALL} onClick={() => setFilter(ALL)} />
        {Object.entries(CATEGORIES).map(([key, val]) => (
          <Chip
            key={key}
            label={val.label}
            active={filter === key}
            onClick={() => setFilter(key as Category)}
            color={CATEGORY_COLORS[key]}
          />
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="px-4 mt-6">
          {filter === ALL ? (
            <EmptyState
              icon={<ShoppingBag size={28} />}
              title="Sin gastos este mes"
              description="Toca + para registrar tu primer gasto."
            />
          ) : (
            <p className="text-center text-xs-ui text-[var(--t3)] mt-8">
              Sin gastos en {CATEGORIES[filter as Category]?.label ?? filter}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col px-4 mt-2">
          <AnimatePresence initial={false}>
            {filtered.map((expense, i) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <ExpenseRow
                  expense={expense}
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

function ExpenseRow({ expense, onEdit, onDelete, isLast }: {
  expense: Expense
  onEdit: () => void
  onDelete: () => void
  isLast: boolean
}) {
  const cat      = CATEGORIES[expense.category as keyof typeof CATEGORIES]
  const catColor = CATEGORY_COLORS[expense.category] ?? 'var(--cat-otros)'
  const initial  = (cat?.label ?? expense.category).charAt(0).toUpperCase()

  return (
    <div
      className={`flex items-center gap-3 py-3.5 ${!isLast ? 'border-b border-[var(--s3)]' : ''}`}
    >
      {/* Category color dot */}
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 self-center"
        style={{ background: catColor }}
      />

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
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={
              expense.shared
                ? { background: 'var(--blue-dim)', color: 'var(--blue-t)' }
                : { background: 'var(--s2)', color: 'var(--t3)' }
            }
          >
            {expense.shared ? 'compartido' : 'personal'}
          </span>
          <span className="text-xs-ui text-[var(--t3)]">{cat?.label ?? expense.category}</span>
        </div>
        {expense.shared && (
          <p className="text-xs-ui text-[var(--blue-t)] mt-0.5">
            Mi parte: {formatCOP(expense.myPart)}
          </p>
        )}
      </div>

      {/* Amount + actions */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <p className="num-md text-[var(--t1)]">{formatCOP(expense.amount)}</p>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onEdit}
            className="text-[var(--t3)] hover:text-[var(--t1)] transition-colors p-1.5 rounded-lg hover:bg-[var(--s2)] btn-press"
            aria-label="Editar gasto"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-[var(--t3)] hover:text-[var(--coral-t)] transition-colors p-1.5 rounded-lg hover:bg-[var(--coral-dim)] btn-press"
            aria-label="Eliminar gasto"
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

function Chip({ label, active, onClick, color }: {
  label: string
  active: boolean
  onClick: () => void
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs-ui font-medium transition-colors btn-press"
      style={
        active
          ? { background: color ?? 'var(--blue)', color: '#fff' }
          : { background: 'var(--s2)', color: 'var(--t2)' }
      }
    >
      {color && !active && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      )}
      {label}
    </button>
  )
}
