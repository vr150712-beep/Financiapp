import { motion } from 'motion/react'

export interface BarSegment {
  key: string
  label: string
  pct: number
  color: string
}

interface StackedBarProps {
  segments: BarSegment[]
  height?: number
}

export function StackedBar({ segments, height = 8 }: StackedBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Bar */}
      <div
        className="flex w-full overflow-hidden rounded-pill gap-px"
        style={{ height }}
      >
        {segments.map((seg, i) => (
          <motion.div
            key={seg.key}
            initial={{ width: 0 }}
            animate={{ width: `${seg.pct}%` }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: seg.color, height: '100%' }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-xs-ui text-[var(--t2)]">
              {seg.label} {Math.round(seg.pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
