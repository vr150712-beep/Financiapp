import { Settings } from 'lucide-react'
import { useProfilesStore } from '@/store'
import { getTabConfig } from '@/app/tabs'
import type { TabId } from '@/app/tabs'
import type { ProfileId } from '@/core'

interface HeaderProps {
  activeTab: TabId
  greeting: string
  onSettings: () => void
  /** Only used when the active tab's config enables the profile switcher */
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
  const tabConfig = getTabConfig(activeTab)

  const activeProfile = activeProfileId ? profiles[activeProfileId] : null
  const isDynamicTitle = tabConfig.headerTitle === null

  const title = isDynamicTitle
    ? (activeProfile?.name ?? '')
    : tabConfig.headerTitle

  const titleColor = isDynamicTitle && activeProfile
    ? activeProfile.color
    : 'var(--t1)'

  return (
    <header className="px-4 pt-5 pb-2">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs-ui text-[var(--t2)]">{greeting}</p>
          <h1
            className="font-display mt-0.5 leading-tight"
            style={{ color: titleColor, fontSize: 34 }}
          >
            {title || tabConfig.headerTitle}
          </h1>
        </div>

        <button
          onClick={onSettings}
          aria-label="Configuración"
          className="mt-1.5 flex-shrink-0 w-10 h-10 rounded-full bg-[var(--s1)] flex items-center justify-center text-[var(--t2)] hover:text-[var(--t1)] transition-colors btn-press"
          style={{ border: 'var(--border)', boxShadow: '0 1px 2px rgba(20,20,15,0.05)' }}
        >
          <Settings size={16} strokeWidth={1.6} />
        </button>
      </div>

      {tabConfig.showProfileSwitcher && onSwitchProfile && (
        <div
          className="inline-flex mt-3 rounded-full"
          style={{ background: 'var(--s1)', border: 'var(--border)', boxShadow: '0 1px 2px rgba(20,20,15,0.05)', padding: 4, gap: 4 }}
        >
          {(['victor', 'partner'] as ProfileId[]).map((id) => {
            const p = profiles[id]
            const isActive = id === activeProfileId
            return (
              <button
                key={id}
                onClick={() => onSwitchProfile(id)}
                className="flex items-center gap-1.5 rounded-full transition-all btn-press"
                style={{
                  padding: isActive ? '5px 14px 5px 5px' : '5px 14px',
                  background: isActive ? p.color + '1A' : 'transparent',
                  border: `0.5px solid ${isActive ? p.color : 'transparent'}`,
                }}
              >
                <div
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive ? p.color : p.color + '1A',
                    color: isActive ? '#fff' : p.color,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {p.name[0]}
                </div>
                <span
                  className="text-sm-ui"
                  style={{ fontWeight: isActive ? 500 : 400, color: isActive ? p.color : 'var(--t2)' }}
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
