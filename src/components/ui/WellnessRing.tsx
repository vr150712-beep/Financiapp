import { motion } from 'motion/react'
import type { WellnessStatus } from '@/core'

const statusColor: Record<WellnessStatus, string> = {
  ok:       'var(--emerald)',
  warning:  'var(--amber)',
  critical: 'var(--coral)',
}

interface WellnessRingProps {
  pct: number
  status: WellnessStatus
  size?: number
  strokeWidth?: number
  colorOverride?: string
}

export function WellnessRing({
  pct,
  status,
  size = 80,
  strokeWidth = 5.5,
  colorOverride,
}: WellnessRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedPct = Math.min(100, Math.max(0, pct))
  const dashOffset = circumference * (1 - clampedPct / 100)
  const color = colorOverride ?? statusColor[status]

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--s2)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {/* Center label */}
      <div
        className="absolute inset-0 flex items-center justify-center num-md"
        style={{ color }}
      >
        {Math.round(clampedPct)}%
      </div>
    </div>
  )
}
