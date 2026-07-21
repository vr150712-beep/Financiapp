import { TABS } from '@/app/tabs'
import type { TabId } from '@/app/tabs'

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-30"
      style={{
        background: 'var(--s1)',
        borderTop: 'var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch h-[56px]">
        {TABS.map(({ id, icon: Icon, label }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] btn-press"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="transition-colors duration-150"
                style={{ color: isActive ? 'var(--blue)' : 'var(--t3)' }}
              >
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <span
                className="transition-colors duration-150 font-medium"
                style={{
                  fontSize: 10,
                  color: isActive ? 'var(--blue)' : 'var(--t3)',
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
