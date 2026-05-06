import type { ReactNode } from 'react'

type BadgeVariant = 'shared' | 'personal' | 'ok' | 'warning' | 'critical'

const styles: Record<BadgeVariant, string> = {
  shared:   'bg-[var(--blue-dim)]    text-[var(--blue-t)]',
  personal: 'bg-[var(--s2)]          text-[var(--t2)]',
  ok:       'bg-[var(--emerald-dim)] text-[var(--emerald-t)]',
  warning:  'bg-[var(--amber-dim)]   text-[var(--amber-t)]',
  critical: 'bg-[var(--coral-dim)]   text-[var(--coral-t)]',
}

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  className?: string
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill label ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
