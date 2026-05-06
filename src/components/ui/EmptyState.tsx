import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  dashed?: boolean
}

export function EmptyState({ icon, title, description, action, dashed = false }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-card text-center ${
        dashed ? 'border border-dashed border-[rgba(29,158,117,0.35)]' : ''
      }`}
    >
      <div className="text-[var(--emerald-t)] text-3xl">{icon}</div>
      <div>
        <p className="text-[var(--t1)] text-sm-ui font-medium">{title}</p>
        {description && (
          <p className="text-[var(--t3)] text-xs-ui mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
