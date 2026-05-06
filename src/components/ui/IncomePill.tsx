import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Plus, Users } from 'lucide-react'
import { formatCOP } from '@/lib/format'

interface IncomePillProps {
  victorIncome: number
  partnerIncome: number
  victorName: string
  partnerName: string
  onClick: () => void
}

export function IncomePill({ victorIncome, partnerIncome, victorName, partnerName, onClick }: IncomePillProps) {
  const totalIncome  = victorIncome + partnerIncome
  const bothEmpty    = victorIncome === 0 && partnerIncome === 0

  return (
    <motion.button
      onClick={onClick}
      layout
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-2 px-4 py-2.5 w-full btn-press rounded-xl
        ${bothEmpty
          ? 'bg-[var(--emerald-dim)] border border-dashed border-[rgba(29,158,117,0.4)]'
          : 'bg-[var(--s1)] border border-[var(--s3)]'
        }
      `}
    >
      <AnimatePresence mode="wait">
        {bothEmpty ? (
          <motion.span
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm-ui w-full justify-center text-[var(--emerald-t)]"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="font-medium">Configura los ingresos del hogar</span>
          </motion.span>
        ) : (
          <motion.span
            key="filled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm-ui w-full"
          >
            {/* Icon */}
            <Users size={13} strokeWidth={2} className="text-[var(--emerald-t)] flex-shrink-0" />

            {/* Per-person pills */}
            <span className="flex items-center gap-1.5 flex-1 min-w-0">
              <PersonBadge
                name={victorName}
                income={victorIncome}
                color="var(--blue-t)"
                dimColor="var(--blue-dim)"
              />
              <span className="text-[var(--t3)] text-[10px]">·</span>
              <PersonBadge
                name={partnerName}
                income={partnerIncome}
                color="var(--pink-t)"
                dimColor="var(--pink-dim)"
              />
            </span>

            {/* Total + chevron */}
            <span className="flex items-center gap-1 flex-shrink-0">
              <span className="text-[var(--t2)] text-[11px]">{formatCOP(totalIncome)}</span>
              <ChevronDown size={13} strokeWidth={1.5} className="text-[var(--t3)]" />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function PersonBadge({ name, income, color, dimColor }: {
  name: string
  income: number
  color: string
  dimColor: string
}) {
  const hasIncome = income > 0
  return (
    <span
      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
      style={{
        backgroundColor: hasIncome ? dimColor : 'var(--s3)',
        color: hasIncome ? color : 'var(--t3)',
      }}
    >
      <span>{name[0]}</span>
      {hasIncome
        ? <span>{formatCOP(income)}</span>
        : <span>—</span>
      }
    </span>
  )
}
