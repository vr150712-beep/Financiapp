import { useState } from 'react'
import { Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useProfilesStore } from '@/store'
import type { ProfileId } from '@/core'

interface ProfileSwitcherProps {
  onSettings: () => void
}

export function ProfileSwitcher({ onSettings }: ProfileSwitcherProps) {
  const [open, setOpen] = useState(false)
  const profiles        = useProfilesStore((s) => s.profiles)
  const activeId        = useProfilesStore((s) => s.activeProfileId)
  const setActive       = useProfilesStore((s) => s.setActiveProfile)

  function select(id: ProfileId) {
    setActive(id)
    setOpen(false)
  }

  return (
    <div className="relative">
      {/* Avatar buttons */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-[var(--s1)] border border-[var(--s3)] rounded-full pl-1 pr-2.5 py-1"
        aria-label="Cambiar perfil"
      >
        <div className="flex -space-x-1.5">
          {(['victor', 'partner'] as ProfileId[]).map((id) => (
            <div
              key={id}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold ring-2 ring-[var(--s1)]"
              style={{
                backgroundColor: profiles[id].color,
                opacity: activeId === id ? 1 : 0.6,
              }}
            >
              {profiles[id].name[0]}
            </div>
          ))}
        </div>
        <span className="text-[11px] text-[var(--t2)] font-medium">
          {profiles[activeId].name}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 bg-[var(--s2)] rounded-card border border-[var(--s3)] z-30 min-w-[160px] overflow-hidden"
            >
              {(['victor', 'partner'] as ProfileId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => select(id)}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm-ui hover:bg-[var(--s3)] transition-colors text-left"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white label"
                    style={{ backgroundColor: profiles[id].color }}
                  >
                    {profiles[id].name[0]}
                  </div>
                  <span className={activeId === id ? 'text-[var(--t1)]' : 'text-[var(--t2)]'}>
                    {profiles[id].name}
                  </span>
                  {activeId === id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--emerald)]" />
                  )}
                </button>
              ))}

              <div className="border-t border-[var(--s3)]" />
              <button
                onClick={() => { setOpen(false); onSettings() }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm-ui text-[var(--t2)] hover:bg-[var(--s3)] transition-colors"
              >
                <Settings size={16} strokeWidth={1.5} />
                Configuración
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
