import { motion } from 'motion/react'
import { formatCOP } from '@/lib/format'

interface EquityBarProps {
  victorName: string
  partnerName: string
  victorPct: number
  partnerPct: number
  victorBurden: number
  partnerBurden: number
}

export function EquityBar({
  victorName,
  partnerName,
  victorPct,
  partnerPct,
  victorBurden,
  partnerBurden,
}: EquityBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Bar */}
      <div className="flex w-full h-2 rounded-pill overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${victorPct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ backgroundColor: 'var(--blue)' }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${partnerPct}%` }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ backgroundColor: 'var(--pink)' }}
        />
      </div>

      {/* Names + amounts */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white label"
            style={{ backgroundColor: 'var(--blue)' }}
          >
            {victorName[0]}
          </div>
          <div>
            <p className="text-[var(--blue-t)] text-xs-ui font-medium">
              {victorName} {Math.round(victorPct)}%
            </p>
            <p className="text-[var(--t2)] text-xs-ui">{formatCOP(victorBurden)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div className="text-right">
            <p className="text-[var(--pink-t)] text-xs-ui font-medium">
              {Math.round(partnerPct)}% {partnerName}
            </p>
            <p className="text-[var(--t2)] text-xs-ui">{formatCOP(partnerBurden)}</p>
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white label"
            style={{ backgroundColor: 'var(--pink)' }}
          >
            {partnerName[0]}
          </div>
        </div>
      </div>
    </div>
  )
}
