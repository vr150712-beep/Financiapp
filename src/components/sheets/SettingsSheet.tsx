import { useState } from 'react'
import { Drawer } from 'vaul'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useProfilesStore } from '@/store'

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
}

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const profiles = useProfilesStore((s) => s.profiles)
  const updateName    = useProfilesStore((s) => s.updateProfileName)
  const updateSavings = useProfilesStore((s) => s.updateSavingsTarget)

  const [victorName,    setVictorName]    = useState(profiles.victor.name)
  const [partnerName,   setPartnerName]   = useState(profiles.partner.name)
  const [victorSavings, setVictorSavings] = useState(String(profiles.victor.savings || ''))
  const [partnerSavings,setPartnerSavings]= useState(String(profiles.partner.savings || ''))

  function handleSave() {
    if (victorName.trim().length >= 2) updateName('victor', victorName.trim())
    if (partnerName.trim().length >= 2) updateName('partner', partnerName.trim())
    updateSavings('victor',  parseFloat(victorSavings)  || 0)
    updateSavings('partner', parseFloat(partnerSavings) || 0)
    toast.success('Configuración guardada')
    onClose()
  }

  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/55 z-40" />
        <Drawer.Content className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 bg-[var(--s1)] rounded-sheet rounded-b-none outline-none">
          <div className="w-8 h-[3px] bg-[var(--s3)] rounded-full mx-auto mt-2.5 mb-1" />
          <div className="px-4 pb-8">
            <div className="flex items-center justify-between py-3">
              <h2 className="text-base-ui font-semibold text-[var(--t1)]">Configuración</h2>
              <button onClick={onClose} className="text-[var(--t3)]"><X size={20} strokeWidth={1.5} /></button>
            </div>

            <div className="flex flex-col gap-4">
              {([['victor', victorName, setVictorName, victorSavings, setVictorSavings, 'var(--blue)'],
                 ['partner', partnerName, setPartnerName, partnerSavings, setPartnerSavings, 'var(--pink)']] as const).map(
                ([id, name, setName, savings, setSavings, color]) => (
                  <div key={id} className="bg-[var(--s2)] rounded-card p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color as string }} />
                      <p className="label text-[var(--t2)]">{id === 'victor' ? 'PERFIL 1' : 'PERFIL 2'}</p>
                    </div>
                    <input
                      inputMode="text"
                      placeholder="Nombre"
                      value={name as string}
                      onChange={(e) => (setName as (v: string) => void)(e.target.value)}
                      className="w-full bg-[var(--s3)] border border-[var(--s3)] rounded-input px-3 py-2.5 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--t3)] text-sm-ui">$</span>
                      <input
                        inputMode="decimal"
                        placeholder="Meta de ahorro mensual"
                        value={savings as string}
                        onChange={(e) => (setSavings as (v: string) => void)(e.target.value.replace(/[^0-9.]/g, ''))}
                        className="w-full bg-[var(--s3)] border border-[var(--s3)] rounded-input pl-7 pr-3 py-2.5 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
                      />
                    </div>
                  </div>
                )
              )}

              <button
                onClick={handleSave}
                className="w-full bg-[var(--blue)] text-white rounded-input py-3.5 text-sm-ui font-medium btn-press"
              >
                Guardar configuración
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
