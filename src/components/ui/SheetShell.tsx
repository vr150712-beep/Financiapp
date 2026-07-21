import type { ReactNode } from 'react'
import { Drawer } from 'vaul'
import { useKeyboardHeight } from '@/hooks'

interface SheetShellProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const MAX_HEIGHT_VH = 90

export function SheetShell({ open, onClose, children }: SheetShellProps) {
  const kbH = useKeyboardHeight()

  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && onClose()} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/55 z-40" />
        <Drawer.Content
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 rounded-sheet rounded-b-none outline-none"
          style={{ bottom: kbH, transition: 'bottom 0.25s ease-out', backgroundColor: 'var(--s1)' }}
        >
          <div className="w-8 h-[3px] rounded-full mx-auto mt-2.5 mb-1" style={{ backgroundColor: 'var(--s3)' }} />
          <div
            className="px-4 overflow-y-auto"
            style={{
              maxHeight: `calc(${MAX_HEIGHT_VH}dvh - ${kbH}px)`,
              paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
            }}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
