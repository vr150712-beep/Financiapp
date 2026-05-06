import { Settings } from 'lucide-react'
import { useProfilesStore } from '@/store'
import type { TabId } from '@/app/tabs'
import type { ProfileId } from '@/core'

const TAB_TITLES: Record<TabId, string> = {
  home:     '',          // dynamic — profile name
  expenses: 'Gastos',
  goals:    'Metas',
  profile:  'Perfil',
}

interface HeaderProps {
  activeTab: TabId
  greeting: string
  onSettings: () => void
  /** Only used on home tab */
  activeProfileId?: ProfileId
  onSwitchProfile?: (id: ProfileId) => void
}

export function Header({
  activeTab,
  greeting,
  onSettings,
  activeProfileId,
  onSwitchProfile,
}: HeaderProps) {
  const profiles = useProfilesStore((s) => s.profiles)

  const isHome = activeTab === 'home'
  const activeProfile = activeProfileId ? profiles[activeProfileId] : null

  const title = isHome
    ? (activeProfile?.name ?? '')
    : TAB_TITLES[activeTab]

  const titleColor = isHome && activeProfile
    ? activeProfile.color
    : 'var(--t1)'

  return (
    <header className="px-4 pt-5 pb-2">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs-ui text-[var(--t3)]">{greeting}</p>
          <h1 className="num-xl mt-0.5 leading-tight" style={{ color: titleColor }}>
            {title || TAB_TITLES[activeTab]}
          </h1>
        </div>

        <button
          onClick={onSettings}
          aria-label="Configuración"
          className="mt-1.5 flex-shrink-0 w-8 h-8 rounded-full bg-[var(--s2)] border border-[var(--s2)] flex items-center justify-center text-[var(--t3)] hover:text-[var(--t1)] transition-colors btn-press"
        >
          <Settings size={15} strokeWidth={1.5} />
        </button>
      </div>

      {/* Profile switcher — only on Home tab */}
      {isHome && onSwitchProfile && (
        <div className="flex gap-2 mt-3">
          {(['victor', 'partner'] as ProfileId[]).map((id) => {
            const p = profiles[id]
            const isActive = id === activeProfileId
            return (
              <button
                key={id}
                onClick={() => onSwitchProfile(id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all btn-press"
                style={{
                  background: isActive ? p.color + '22' : 'var(--s2)',
                  border: `1px solid ${isActive ? p.color + '44' : 'transparent'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: p.color, fontSize: 9, fontWeight: 700 }}
                >
                  {p.name[0]}
                </div>
                <span
                  className="text-xs-ui font-medium"
                  style={{ color: isActive ? p.color : 'var(--t2)' }}
                >
                  {p.name}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
