import { useState, useEffect, useCallback } from 'react'
import { Drawer } from 'vaul'
import { toast } from 'sonner'
import { X, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { useExpensesStore, useProfilesStore } from '@/store'
import { useSplitRatio, useKeyboardHeight } from '@/hooks'
import { CATEGORIES, ExpenseSchema, type Category, type ProfileId } from '@/core'
import { calcSuggestedPart } from '@/core'
import { formatCOP, formatInputCOP, parseInputCOP } from '@/lib/format'
import { CATEGORY_COLORS } from '@/components/widgets/DistributionWidget'
import type { Expense } from '@/core'

// Top N categories shown by default before "ver más"
const TOP_CATEGORIES = ['vivienda', 'alimentacion', 'transporte', 'suscripciones', 'salud', 'entretenimiento']
const EXTRA_CATEGORIES = Object.keys(CATEGORIES).filter((k) => !TOP_CATEGORIES.includes(k))

interface ExpenseSheetProps {
  open: boolean
  onClose: () => void
  ownerId: ProfileId
  initialShared?: boolean
  editingExpense?: Expense | null
}

export function ExpenseSheet({
  open,
  onClose,
  ownerId,
  initialShared = false,
  editingExpense = null,
}: ExpenseSheetProps) {
  const isEditing = editingExpense !== null

  // Amount stored as a formatted display string (with dots), raw digits underneath
  const [amountDisplay, setAmountDisplay] = useState('')
  const [label,         setLabel]         = useState('')
  const [category,      setCategory]      = useState<Category>('alimentacion')
  const [shared,        setShared]        = useState(false)
  const [myPartDisplay, setMyPartDisplay] = useState('')
  const [showMoreCats,  setShowMoreCats]  = useState(false)
  const [errors,        setErrors]        = useState<Record<string, string>>({})

  const addExpense    = useExpensesStore((s) => s.addExpense)
  const updateExpense = useExpensesStore((s) => s.updateExpense)
  const profiles      = useProfilesStore((s) => s.profiles)

  const { victorRatio, partnerRatio } = useSplitRatio()
  const kbH = useKeyboardHeight()
  const effectiveOwner = isEditing ? editingExpense.ownerId : ownerId
  const ratio          = effectiveOwner === 'victor' ? victorRatio : partnerRatio

  const numAmount  = parseInputCOP(amountDisplay)
  const numMyPart  = parseInputCOP(myPartDisplay)
  const suggested  = calcSuggestedPart(numAmount, ratio)

  const diff           = numMyPart - suggested
  const isProportional = Math.abs(diff) < 100
  const diffLabel      = isProportional
    ? 'justo proporcional — basado en tus ingresos'
    : diff > 0
    ? `pagas ${formatCOP(diff)} más de lo proporcional`
    : `pagas ${formatCOP(Math.abs(diff))} menos de lo proporcional`

  // Populate form when sheet opens
  useEffect(() => {
    if (!open) return
    if (isEditing) {
      setAmountDisplay(formatInputCOP(String(editingExpense.amount)))
      setLabel(editingExpense.label)
      setCategory(editingExpense.category)
      setShared(editingExpense.shared)
      setMyPartDisplay(editingExpense.shared ? formatInputCOP(String(editingExpense.myPart)) : '')
    } else {
      setAmountDisplay('')
      setLabel('')
      setCategory('alimentacion')
      setShared(initialShared)
      setMyPartDisplay('')
    }
    setShowMoreCats(false)
    setErrors({})
  }, [open, isEditing, editingExpense, initialShared])

  // Auto-fill suggested part when amount/shared changes (create mode only)
  useEffect(() => {
    if (isEditing) return
    if (shared && numAmount > 0) {
      setMyPartDisplay(formatInputCOP(String(suggested)))
    }
  }, [amountDisplay, shared, suggested, isEditing])

  function handleAmountChange(raw: string) {
    const digits   = raw.replace(/\D/g, '')
    const display  = digits ? parseInt(digits, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
    setAmountDisplay(display)
    setErrors((er) => ({ ...er, amount: '' }))
  }

  function handleMyPartChange(raw: string) {
    const digits  = raw.replace(/\D/g, '')
    const display = digits ? parseInt(digits, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
    setMyPartDisplay(display)
    setErrors((er) => ({ ...er, myPart: '' }))
  }

  function handleSave() {
    const parsed = ExpenseSchema.safeParse({
      id:        isEditing ? editingExpense.id : crypto.randomUUID(),
      ownerId:   effectiveOwner,
      label:     label.trim(),
      amount:    numAmount,
      category,
      shared,
      myPart:    shared ? numMyPart : numAmount,
      otherPart: shared ? numAmount - numMyPart : 0,
    })

    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors
      setErrors({ amount: fe.amount?.[0] ?? '', label: fe.label?.[0] ?? '', myPart: fe.myPart?.[0] ?? '' })
      return
    }

    if (shared && numMyPart > numAmount) {
      setErrors({ myPart: 'Tu parte no puede superar el total' })
      return
    }

    if (isEditing) {
      updateExpense(parsed.data)
      toast.success('Gasto actualizado')
    } else {
      addExpense(parsed.data)
      toast.success('Gasto registrado')
    }
    onClose()
  }

  const ownerProfile = profiles[effectiveOwner]

  // Scroll focused input into view once keyboard finishes animating
  const scrollOnFocus = useCallback((e: { currentTarget: HTMLInputElement }) => {
    const el = e.currentTarget
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 320)
  }, [])

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

          <div className="px-4 pb-8 overflow-y-auto" style={{ maxHeight: `calc(92dvh - ${kbH}px)` }}>
            {/* Header */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: ownerProfile.color, fontSize: 10, fontWeight: 700 }}
                >
                  {ownerProfile.name[0]}
                </div>
                <h2 className="text-base-ui font-semibold text-[var(--t1)]">
                  {isEditing ? 'Editar gasto' : `Gasto de ${ownerProfile.name}`}
                </h2>
              </div>
              <button onClick={onClose} className="text-[var(--t3)] p-1 btn-press">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* ── Hero amount input ── */}
            <div className="bg-[var(--s2)] rounded-xl px-4 py-4 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="num-xl text-[var(--t3)]">$</span>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={amountDisplay}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  onFocus={scrollOnFocus}
                  className="bg-transparent num-xl text-[var(--t1)] w-full focus:outline-none placeholder:text-[var(--s3)]"
                />
              </div>
              {errors.amount && <p className="text-xs-ui text-[var(--coral-t)] mt-1">{errors.amount}</p>}
            </div>

            {/* ── Category pills ── */}
            <div className="mb-4">
              <p className="label text-[var(--t3)] mb-2">CATEGORÍA</p>
              <div className="flex flex-wrap gap-2">
                {TOP_CATEGORIES.map((key) => (
                  <CategoryPill
                    key={key}
                    catKey={key as Category}
                    active={category === key}
                    onSelect={() => setCategory(key as Category)}
                  />
                ))}

                {/* Expandable extra categories */}
                {showMoreCats && EXTRA_CATEGORIES.map((key) => (
                  <CategoryPill
                    key={key}
                    catKey={key as Category}
                    active={category === key}
                    onSelect={() => setCategory(key as Category)}
                  />
                ))}

                {EXTRA_CATEGORIES.length > 0 && (
                  <button
                    onClick={() => setShowMoreCats((v) => !v)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs-ui text-[var(--t3)] bg-[var(--s2)] btn-press"
                  >
                    {showMoreCats ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    {showMoreCats ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            </div>

            {/* ── Name ── */}
            <div className="mb-4">
              <p className="label text-[var(--t3)] mb-1.5">NOMBRE</p>
              <input
                inputMode="text"
                placeholder="Ej. Arriendo, Mercado…"
                value={label}
                onChange={(e) => { setLabel(e.target.value); setErrors((er) => ({ ...er, label: '' })) }}
                onFocus={scrollOnFocus}
                className="w-full bg-[var(--s2)] border border-[var(--s3)] rounded-lg px-3 py-3 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
              />
              {errors.label && <p className="text-xs-ui text-[var(--coral-t)] mt-1">{errors.label}</p>}
            </div>

            {/* ── Shared toggle ── */}
            <div className="mb-4">
              <button
                onClick={() => setShared((v) => !v)}
                className="flex items-center justify-between w-full bg-[var(--s2)] rounded-lg px-4 py-3 btn-press"
              >
                <span className="text-sm-ui text-[var(--t1)]">Gasto compartido</span>
                <div className={`w-10 h-5.5 rounded-full relative transition-colors ${shared ? 'bg-[var(--emerald)]' : 'bg-[var(--s3)]'}`}
                  style={{ height: 22, width: 40 }}
                >
                  <div className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform ${shared ? 'translate-x-[20px]' : 'translate-x-[3px]'}`} />
                </div>
              </button>
            </div>

            {/* ── Mi parte (shared only) ── */}
            {shared && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="label text-[var(--t3)]">MI PARTE</p>
                  {numAmount > 0 && (
                    <span className="text-xs-ui text-[var(--t2)]">{formatCOP(numMyPart)}</span>
                  )}
                </div>
                <div className="bg-[var(--s2)] border border-[var(--s3)] rounded-lg px-3 py-3 flex items-center gap-1.5">
                  <span className="text-sm-ui text-[var(--t3)]">$</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={myPartDisplay}
                    onChange={(e) => handleMyPartChange(e.target.value)}
                    onFocus={scrollOnFocus}
                    disabled={numAmount === 0}
                    className="bg-transparent text-sm-ui text-[var(--t1)] w-full focus:outline-none placeholder:text-[var(--t3)]"
                  />
                </div>
                {errors.myPart && <p className="text-xs-ui text-[var(--coral-t)] mt-1">{errors.myPart}</p>}

                {numAmount > 0 && (
                  <div className="mt-2 flex items-start gap-2 bg-[var(--emerald-dim)] border border-[rgba(29,158,117,0.2)] rounded-lg px-3 py-2.5">
                    <CheckCircle2 size={14} className="text-[var(--emerald)] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-[var(--emerald-t)] text-xs-ui font-medium">
                        Sugerido {formatCOP(suggested)} ({Math.round(ratio * 100)}% proporcional)
                      </p>
                      <p className="text-[var(--t3)] text-xs-ui mt-0.5">{diffLabel}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CTA ── */}
            <button
              onClick={handleSave}
              className="w-full text-white rounded-lg py-3.5 text-sm-ui font-semibold btn-press mt-1"
              style={{ backgroundColor: ownerProfile.color }}
            >
              {isEditing ? 'Guardar cambios' : 'Guardar gasto'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

/* ── Category pill ──────────────────────────────────────────── */
function CategoryPill({ catKey, active, onSelect }: {
  catKey: Category
  active: boolean
  onSelect: () => void
}) {
  const cat   = CATEGORIES[catKey]
  const color = CATEGORY_COLORS[catKey] ?? 'var(--cat-otros)'

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs-ui font-medium btn-press transition-all"
      style={
        active
          ? { background: color + '33', border: `1px solid ${color}66`, color }
          : { background: 'var(--s2)', border: '1px solid transparent', color: 'var(--t2)' }
      }
    >
      <span>{cat?.icon}</span>
      <span>{cat?.label}</span>
    </button>
  )
}
