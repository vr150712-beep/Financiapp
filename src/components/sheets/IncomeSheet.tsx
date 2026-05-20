import { useState } from 'react'
import { Drawer } from 'vaul'
import { toast } from 'sonner'
import { X, Trash2, Plus, ChevronUp } from 'lucide-react'
import { useProfilesStore } from '@/store'
import { selectProfileIncome } from '@/store'
import { IncomeSourceSchema } from '@/core'
import { formatCOP, parseInputCOP } from '@/lib/format'
import { useKeyboardHeight } from '@/hooks'
import type { ProfileId } from '@/core'

interface IncomeSheetProps {
  open: boolean
  onClose: () => void
  profileId?: ProfileId   // kept for compat but unused — sheet shows both
}

interface PersonFormState {
  name: string
  amount: string
  errors: { name?: string; amount?: string }
  expanded: boolean
}

const EMPTY_FORM: PersonFormState = { name: '', amount: '', errors: {}, expanded: false }

export function IncomeSheet({ open, onClose }: IncomeSheetProps) {
  const profiles    = useProfilesStore((s) => s.profiles)
  const addSource   = useProfilesStore((s) => s.addIncomeSource)
  const removeSource= useProfilesStore((s) => s.removeIncomeSource)
  const kbH         = useKeyboardHeight()

  const [forms, setForms] = useState<Record<ProfileId, PersonFormState>>({
    victor:  { ...EMPTY_FORM },
    partner: { ...EMPTY_FORM },
  })

  const victorIncome  = selectProfileIncome(profiles.victor)
  const partnerIncome = selectProfileIncome(profiles.partner)
  const totalIncome   = victorIncome + partnerIncome
  const victorPct     = totalIncome > 0 ? Math.round((victorIncome / totalIncome) * 100) : 50
  const partnerPct    = 100 - victorPct

  function setForm(id: ProfileId, patch: Partial<PersonFormState>) {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  function handleAdd(id: ProfileId) {
    const f = forms[id]
    const parsed = IncomeSourceSchema.safeParse({
      id: crypto.randomUUID(),
      name: f.name.trim(),
      amount: parseFloat(f.amount),
    })

    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors
      setForm(id, { errors: { name: fe.name?.[0], amount: fe.amount?.[0] } })
      return
    }

    addSource(id, parsed.data.name, parsed.data.amount)
    toast.success(`Ingreso de ${profiles[id].name} guardado`)
    setForm(id, { name: '', amount: '', errors: {}, expanded: false })
  }

  function handleRemove(id: ProfileId, sourceId: string) {
    removeSource(id, sourceId)
    toast.success('Ingreso eliminado')
  }

  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/55 z-40" />
        <Drawer.Content
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 bg-[var(--s1)] rounded-t-[16px] outline-none"
          style={{ bottom: kbH, transition: 'bottom 0.25s ease-out' }}
        >
          {/* Handle */}
          <div className="w-8 h-[3px] bg-[var(--s3)] rounded-full mx-auto mt-2.5 mb-1" />

          <div className="px-4 pb-8 overflow-y-auto" style={{ maxHeight: `calc(88dvh - ${kbH}px)` }}>
            {/* Header */}
            <div className="flex items-center justify-between py-3 mb-1">
              <div>
                <h2 className="text-base-ui font-semibold text-[var(--t1)]">Ingresos del hogar</h2>
                <p className="text-xs-ui text-[var(--t3)] mt-0.5">
                  {totalIncome > 0 ? formatCOP(totalIncome) + ' / mes en total' : 'Configura los ingresos de cada uno'}
                </p>
              </div>
              <button onClick={onClose} className="text-[var(--t3)]">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Proportion bar */}
            {totalIncome > 0 && (
              <div className="mb-4 bg-[var(--s2)] rounded-xl p-3">
                <p className="label text-[var(--t3)] mb-2">PROPORCIÓN DE GASTOS</p>
                <div className="h-2 w-full rounded-full overflow-hidden flex mb-1.5">
                  <div
                    className="h-full rounded-l-full transition-all duration-500"
                    style={{ width: `${victorPct}%`, backgroundColor: 'var(--blue)' }}
                  />
                  <div
                    className="h-full rounded-r-full transition-all duration-500"
                    style={{ width: `${partnerPct}%`, backgroundColor: 'var(--pink)' }}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs-ui" style={{ color: 'var(--blue-t)' }}>
                    {profiles.victor.name} {victorPct}%
                  </span>
                  <span className="text-xs-ui" style={{ color: 'var(--pink-t)' }}>
                    {partnerPct}% {profiles.partner.name}
                  </span>
                </div>
                <p className="text-xs-ui text-[var(--t3)] mt-2 text-center leading-relaxed">
                  Los gastos compartidos se sugieren en esta proporción
                </p>
              </div>
            )}

            {/* Victor section */}
            <PersonSection
              id="victor"
              profile={profiles.victor}
              income={victorIncome}
              form={forms.victor}
              onFormChange={(patch) => setForm('victor', patch)}
              onAdd={() => handleAdd('victor')}
              onRemove={(sid) => handleRemove('victor', sid)}
            />

            <div className="h-3" />

            {/* Partner section */}
            <PersonSection
              id="partner"
              profile={profiles.partner}
              income={partnerIncome}
              form={forms.partner}
              onFormChange={(patch) => setForm('partner', patch)}
              onAdd={() => handleAdd('partner')}
              onRemove={(sid) => handleRemove('partner', sid)}
            />

            <button
              onClick={onClose}
              className="w-full mt-4 py-3 text-sm-ui text-[var(--t2)] text-center"
            >
              Listo
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

/* ─── Per-person section ─────────────────────────────────────── */
interface PersonSectionProps {
  id: ProfileId
  profile: { name: string; color: string; sources: { id: string; name: string; amount: number }[] }
  income: number
  form: PersonFormState
  onFormChange: (patch: Partial<PersonFormState>) => void
  onAdd: () => void
  onRemove: (sourceId: string) => void
}

function PersonSection({ id, profile, income, form, onFormChange, onAdd, onRemove }: PersonSectionProps) {
  return (
    <div className="bg-[var(--s2)] rounded-xl overflow-hidden">
      {/* Person header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: profile.color }}
        >
          {profile.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-sm-ui font-semibold text-[var(--t1)]">{profile.name}</p>
          <p className="text-xs-ui text-[var(--t3)]">
            {income > 0 ? formatCOP(income) + ' / mes' : 'Sin ingresos configurados'}
          </p>
        </div>
        {income > 0 && (
          <span className="text-xs-ui font-semibold text-[var(--emerald-t)] bg-[var(--emerald-dim)] px-2 py-0.5 rounded-full">
            {formatCOP(income)}
          </span>
        )}
      </div>

      {/* Source list */}
      {profile.sources.length > 0 && (
        <div className="border-t border-[var(--s3)]">
          {profile.sources.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--s3)] last:border-b-0">
              <div>
                <p className="text-sm-ui text-[var(--t1)]">{s.name}</p>
                <p className="text-xs-ui text-[var(--t3)]">{formatCOP(s.amount)} / mes</p>
              </div>
              <button
                onClick={() => onRemove(s.id)}
                className="text-[var(--t3)] hover:text-[var(--coral-t)] transition-colors p-1.5"
                aria-label="Eliminar"
              >
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add button / expand form */}
      <div className="border-t border-[var(--s3)]">
        {!form.expanded ? (
          <button
            onClick={() => onFormChange({ expanded: true })}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm-ui text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
          >
            <Plus size={15} strokeWidth={2} />
            Añadir fuente de ingreso
          </button>
        ) : (
          <div className="px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <p className="label text-[var(--t3)]">NUEVA FUENTE</p>
              <button onClick={() => onFormChange({ expanded: false, name: '', amount: '', errors: {} })} className="text-[var(--t3)]">
                <ChevronUp size={14} />
              </button>
            </div>

            <input
              inputMode="text"
              placeholder="Nombre (ej. Salario)"
              value={form.name}
              onChange={(e) => onFormChange({ name: e.target.value, errors: { ...form.errors, name: undefined } })}
              className="w-full bg-[var(--s3)] rounded-lg px-3 py-2.5 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
            />
            {form.errors.name && <p className="text-xs-ui text-[var(--coral-t)]">{form.errors.name}</p>}

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--t3)] text-sm-ui">$</span>
              <input
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="0"
                value={form.amount}
                onChange={(e) => onFormChange({ amount: e.target.value.replace(/[^0-9.]/g, ''), errors: { ...form.errors, amount: undefined } })}
                className="w-full bg-[var(--s3)] rounded-lg pl-7 pr-3 py-2.5 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
              />
            </div>
            {form.errors.amount && <p className="text-xs-ui text-[var(--coral-t)]">{form.errors.amount}</p>}

            <button
              onClick={onAdd}
              className="w-full bg-[var(--blue)] text-white rounded-lg py-2.5 text-sm-ui font-medium btn-press mt-1"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
