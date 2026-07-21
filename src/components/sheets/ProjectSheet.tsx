import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useProjectsStore } from '@/store'
import { useSplitRatio, useScrollOnFocus } from '@/hooks'
import { ProjectSchema } from '@/core'
import { formatCOP, formatInputCOP, parseInputCOP } from '@/lib/format'
import { SheetShell } from '@/components/ui/SheetShell'

interface ProjectSheetProps {
  open: boolean
  onClose: () => void
}

export function ProjectSheet({ open, onClose }: ProjectSheetProps) {
  const [label,  setLabel]  = useState('')
  const [amount, setAmount] = useState('')
  const [months, setMonths] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addProject = useProjectsStore((s) => s.addProject)
  const { victorRatio, partnerRatio } = useSplitRatio()
  const scrollOnFocus = useScrollOnFocus()

  const numAmount = parseInputCOP(amount) || 0
  const numMonths = parseInt(months)   || 0
  const showPreview = numAmount > 0 && numMonths > 0
  const isValid = label.trim().length >= 2 && numAmount > 0 && numMonths >= 1 && numMonths <= 120

  useEffect(() => {
    if (open) {
      setLabel(''); setAmount(''); setMonths(''); setErrors({})
    }
  }, [open])

  function handleSave() {
    const parsed = ProjectSchema.safeParse({
      id:     crypto.randomUUID(),
      label:  label.trim(),
      amount: numAmount,
      months: numMonths,
    })

    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors
      setErrors({
        label:  fe.label?.[0]  ?? '',
        amount: fe.amount?.[0] ?? '',
        months: fe.months?.[0] ?? '',
      })
      return
    }

    addProject(parsed.data)
    toast.success('Proyecto creado')
    onClose()
  }

  return (
    <SheetShell open={open} onClose={onClose}>
            <div className="flex items-center justify-between py-3">
              <h2 className="text-base-ui font-semibold text-[var(--t1)]">Nuevo proyecto</h2>
              <button onClick={onClose} className="text-[var(--t3)]"><X size={20} strokeWidth={1.5} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <p className="label text-[var(--t3)] mb-1.5">NOMBRE</p>
                <input
                  inputMode="text"
                  placeholder="Ej. Viaje a Europa"
                  value={label}
                  onChange={(e) => { setLabel(e.target.value); setErrors((er) => ({ ...er, label: '' })) }}
                  onFocus={scrollOnFocus}
                  className="w-full bg-[var(--s2)] border border-[var(--s3)] rounded-input px-3 py-3 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
                />
                {errors.label && <p className="text-xs-ui text-[var(--coral-t)] mt-1">{errors.label}</p>}
              </div>

              <div>
                <p className="label text-[var(--t3)] mb-1.5">VALOR ESTIMADO</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--t3)]">$</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => { setAmount(formatInputCOP(e.target.value)); setErrors((er) => ({ ...er, amount: '' })) }}
                    onFocus={scrollOnFocus}
                    className="w-full bg-[var(--s2)] border border-[var(--s3)] rounded-input pl-7 pr-3 py-3 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
                  />
                </div>
                {errors.amount && <p className="text-xs-ui text-[var(--coral-t)] mt-1">{errors.amount}</p>}
              </div>

              <div>
                <p className="label text-[var(--t3)] mb-1.5">MESES</p>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="12"
                  value={months}
                  onChange={(e) => { setMonths(e.target.value.replace(/[^0-9]/g, '')); setErrors((er) => ({ ...er, months: '' })) }}
                  onFocus={scrollOnFocus}
                  className="w-full bg-[var(--s2)] border border-[var(--s3)] rounded-input px-3 py-3 text-sm-ui text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-[1.5px] focus:ring-[var(--emerald)]"
                />
                {errors.months && <p className="text-xs-ui text-[var(--coral-t)] mt-1">{errors.months}</p>}
              </div>

              {/* Live preview */}
              {showPreview && (
                <div className="bg-[var(--s2)] rounded-card p-3 border border-[var(--s3)]">
                  <p className="label text-[var(--t3)] mb-2">APORTE MENSUAL</p>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs-ui text-[var(--blue-t)]">Víctor</p>
                      <p className="num-md text-[var(--t1)]">{formatCOP(numAmount * victorRatio / numMonths)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs-ui text-[var(--pink-t)]">Camila</p>
                      <p className="num-md text-[var(--t1)]">{formatCOP(numAmount * partnerRatio / numMonths)}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={!isValid}
                className="w-full bg-[var(--t1)] text-white rounded-input py-3.5 text-sm-ui font-medium btn-press mt-1"
              >
                Crear proyecto
              </button>
            </div>
    </SheetShell>
  )
}
