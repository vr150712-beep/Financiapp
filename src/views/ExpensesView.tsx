import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react'
import { toast } from 'sonner'
import { ShoppingBag, Pencil, Trash2 } from 'lucide-react'
import { useExpensesStore, useProfilesStore } from '@/store'
import { useFilteredExpenses, useWellness } from '@/hooks'
import { EmptyState } from '@/components/ui/EmptyState'
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TINTS, type Category } from '@/core'
import { formatCOP } from '@/lib/format'
import type { Expense, ProfileId } from '@/core'

const ALL = 'all'
type Filter = Category | typeof ALL

interface ExpensesViewProps {
  profileId: ProfileId
  onEdit: (expense: Expense) => void
  showSummary?: boolean
}

export function ExpensesView({ profileId, onEdit, showSummary = false }: ExpensesViewProps) {
  const [filter, setFilter] = useState<Filter>(ALL)

  const profiles = useProfilesStore((s) => s.profiles)
  const remove   = useExpensesStore((s) => s.removeExpense)
  const restore  = useExpensesStore((s) => s.restoreExpense)

  const filtered = useFilteredExpenses(profileId, filter)
  const wellness = useWellness(profileId)

  function handleDelete(expense: Expense) {
    remove(expense.id)
    toast('Gasto eliminado', {
      action: { label: 'Deshacer', onClick: () => restore(expense) },
      duration: 5000,
    })
  }

  return (
    <div className="flex flex-col pb-4">
      {showSummary && (
        <div className="px-4 mb-3">
          <SummaryCard
            profileName={profiles[profileId].name}
            profileColor={profiles[profileId].color}
            personal={wellness.personalBurden}
            shared={wellness.sharedBurden}
            total={wellness.totalBurden}
          />
        </div>
      )}

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
        <div className="px-4 mt-2">
          <div className="flex justify-between items-baseline mb-3">
            <span className="label text-[var(--t2)]">
              {showSummary ? 'TODOS LOS MOVIMIENTOS' : 'MOVIMIENTOS RECIENTES'}
            </span>
            {showSummary && (
              <span className="text-xs-ui text-[var(--t3)]">
                {filtered.length} gasto{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
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
                    profileId={profileId}
                    ownerName={profiles[expense.ownerId].name}
                    onEdit={() => onEdit(expense)}
                    onDelete={() => handleDelete(expense)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ profileName, profileColor, personal, shared, total }: {
  profileName: string
  profileColor: string
  personal: number
  shared: number
  total: number
}) {
  return (
    <div className="bg-[var(--s1)] rounded-card p-5" style={{ boxShadow: 'var(--shadow-card)', border: 'var(--border)' }}>
      <p className="label text-[var(--t2)] mb-2">GASTOS DE {profileName.toUpperCase()}</p>
      <p className="num-xl text-[var(--t1)] leading-none">{formatCOP(total)}</p>
      <p className="text-xs-ui text-[var(--t2)] mt-1">este mes</p>

      <div className="my-4" style={{ borderTop: 'var(--border)' }} />

      <div className="flex gap-8">
        <div>
          <p className="label text-[var(--t2)] mb-1">PERSONAL</p>
          <p className="num-md text-[var(--t1)]">{formatCOP(personal)}</p>
        </div>
        <div>
          <p className="label text-[var(--t2)] mb-1">COMPARTIDO</p>
          <p className="num-md" style={{ color: profileColor }}>{formatCOP(shared)}</p>
        </div>
      </div>
    </div>
  )
}

const ACTION_WIDTH = 60
const REVEAL_WIDTH = ACTION_WIDTH * 2

function ExpenseRow({ expense, profileId, ownerName, onEdit, onDelete }: {
  expense: Expense
  profileId: ProfileId
  ownerName: string
  onEdit: () => void
  onDelete: () => void
}) {
  const cat      = CATEGORIES[expense.category as keyof typeof CATEGORIES]
  const catColor = CATEGORY_COLORS[expense.category] ?? 'var(--cat-otros)'
  const catTint  = CATEGORY_TINTS[expense.category] ?? 'var(--s2)'
  const isOwner  = expense.ownerId === profileId
  const myPart   = expense.shared ? (isOwner ? expense.myPart : expense.otherPart) : expense.amount

  const ownership = expense.shared
    ? (isOwner ? 'compartido' : `compartido · ${ownerName}`)
    : 'personal'

  const x = useMotionValue(0)
  const [isOpen, setIsOpen] = useState(false)

  function openActions() {
    animate(x, -REVEAL_WIDTH, { type: 'spring', stiffness: 500, damping: 40 })
    setIsOpen(true)
  }
  function closeActions() {
    animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
    setIsOpen(false)
  }

  return (
    <div className="relative rounded-card overflow-hidden" style={{ boxShadow: 'var(--shadow-card)', border: '0.5px solid var(--border-soft)' }}>
      {/* Swipe-revealed actions */}
      <div className="absolute inset-y-0 right-0 flex" style={{ width: REVEAL_WIDTH }}>
        <button
          onClick={() => { closeActions(); onEdit() }}
          className="flex items-center justify-center btn-press"
          style={{ width: ACTION_WIDTH, background: 'var(--s2)', color: 'var(--t2)' }}
          aria-label="Editar gasto"
        >
          <Pencil size={18} strokeWidth={1.75} />
        </button>
        <button
          onClick={() => { closeActions(); onDelete() }}
          className="flex items-center justify-center btn-press"
          style={{ width: ACTION_WIDTH, background: 'var(--coral)', color: '#fff' }}
          aria-label="Eliminar gasto"
        >
          <Trash2 size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Front layer */}
      <motion.div
        className="relative flex items-center gap-3 bg-[var(--s1)] px-4 py-3"
        style={{ x, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: -REVEAL_WIDTH, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          if (info.offset.x < -REVEAL_WIDTH / 2 || info.velocity.x < -400) openActions()
          else closeActions()
        }}
        onClick={() => { if (isOpen) closeActions() }}
      >
        {/* Category icon tile */}
        <div
          className="w-10 h-10 rounded-input flex items-center justify-center flex-shrink-0 text-[17px]"
          style={{ background: catTint }}
        >
          {cat?.icon ?? '📦'}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm-ui text-[var(--t1)] truncate leading-tight mb-1">{expense.label}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: catColor }} />
            <span className="text-xs-ui text-[var(--t2)] truncate">{cat?.label ?? expense.category} · {ownership}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <p className="num-md text-[var(--t1)]">{formatCOP(expense.amount)}</p>
          {expense.shared && (
            <p className="text-xs-ui" style={{ color: 'var(--blue-t)' }}>Mi parte {formatCOP(myPart)}</p>
          )}
        </div>
      </motion.div>
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
          ? { background: 'var(--t1)', color: '#fff' }
          : { background: 'var(--s1)', color: 'var(--t2)', border: 'var(--border)' }
      }
    >
      {color && !active && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      )}
      {label}
    </button>
  )
}
