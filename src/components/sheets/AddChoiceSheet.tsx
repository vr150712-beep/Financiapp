import { ReceiptText, Target, X } from 'lucide-react'
import { SheetShell } from '@/components/ui/SheetShell'

interface AddChoiceSheetProps {
  open: boolean
  onClose: () => void
  onChooseExpense: () => void
  onChooseProject: () => void
}

export function AddChoiceSheet({ open, onClose, onChooseExpense, onChooseProject }: AddChoiceSheetProps) {
  return (
    <SheetShell open={open} onClose={onClose}>
      <div className="flex items-center justify-between py-3">
        <h2 className="text-base-ui font-semibold text-[var(--t1)]">¿Qué deseas agregar?</h2>
        <button onClick={onClose} className="text-[var(--t3)] p-1 btn-press">
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-3 pb-2">
        <button
          onClick={onChooseExpense}
          className="flex items-center gap-3 w-full bg-[var(--s2)] rounded-xl px-4 py-4 btn-press text-left"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--blue-dim)' }}
          >
            <ReceiptText size={20} color="var(--blue-t)" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm-ui font-semibold text-[var(--t1)]">Gasto</p>
            <p className="text-xs-ui text-[var(--t3)]">Registrar un gasto personal o compartido</p>
          </div>
        </button>

        <button
          onClick={onChooseProject}
          className="flex items-center gap-3 w-full bg-[var(--s2)] rounded-xl px-4 py-4 btn-press text-left"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--emerald-dim)' }}
          >
            <Target size={20} color="var(--emerald-t)" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm-ui font-semibold text-[var(--t1)]">Meta</p>
            <p className="text-xs-ui text-[var(--t3)]">Crear un proyecto o meta de pareja</p>
          </div>
        </button>
      </div>
    </SheetShell>
  )
}
