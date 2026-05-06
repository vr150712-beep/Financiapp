import type { ReactNode } from 'react'
import { Home, ReceiptText, Target, UserCircle } from 'lucide-react'
import type { TabId } from '@/app/tabs'

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS: { id: TabId; icon: ReactNode; label: string }[] = [
  { id: 'home',     icon: <Home     size={22} strokeWidth={1.6} />, label: 'Inicio'  },
  { id: 'expenses', icon: <ReceiptText size={22} strokeWidth={1.6} />, label: 'Gastos'  },
  { id: 'goals',    icon: <Target   size={22} strokeWidth={1.6} />, label: 'Metas'   },
  { id: 'profile',  icon: <UserCircle size={22} strokeWidth={1.6} />, label: 'Perfil'  },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-30"
      style={{
        background: 'var(--bg0)',
        borderTop: '1px solid var(--s2)',
      }}
    >
      <div className="flex items-stretch h-[56px]">
        {TABS.map(({ id, icon, label }) => {
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
                {icon}
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
