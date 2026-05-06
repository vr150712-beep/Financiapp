import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { EquityBar } from '@/components/ui/EquityBar'
import { useEquity } from '@/hooks'
import { useProfilesStore } from '@/store'
import { formatCOP } from '@/lib/format'

export function EquityWidget() {
  const { victorBurden, partnerBurden, totalShared, victorPct, partnerPct } = useEquity()
  const profiles = useProfilesStore((s) => s.profiles)

  if (totalShared === 0) {
    return (
      <div className="bg-[var(--s1)] rounded-card p-4">
        <p className="label text-[var(--t3)] mb-3">EQUIDAD DE PAREJA</p>
        {/* Ghost bicolor bar */}
        <div className="h-2 w-full rounded-full overflow-hidden flex opacity-30">
          <div className="bg-[var(--blue)] h-full" style={{ width: '50%' }} />
          <div className="bg-[var(--pink)] h-full" style={{ width: '50%' }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs-ui opacity-30" style={{ color: 'var(--blue-t)' }}>
            {profiles.victor.name}
          </span>
          <span className="text-xs-ui opacity-30" style={{ color: 'var(--pink-t)' }}>
            {profiles.partner.name}
          </span>
        </div>
        <p className="text-xs-ui text-[var(--t3)] mt-2 text-center">
          Agrega gastos compartidos para ver el balance
        </p>
      </div>
    )
  }

  const diff        = Math.abs(victorBurden - partnerBurden)
  const isBalanced  = diff < totalShared * 0.05

  return (
    <div className="bg-[var(--s1)] rounded-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="label text-[var(--t3)]">EQUIDAD DE PAREJA</p>
        {isBalanced ? (
          <span className="flex items-center gap-1 label text-[var(--emerald-t)]">
            <CheckCircle2 size={10} /> BALANCEADO
          </span>
        ) : (
          <span className="flex items-center gap-1 label text-[var(--amber-t)]">
            <AlertTriangle size={10} /> DESBALANCEADO
          </span>
        )}
      </div>

      <EquityBar
        victorName={profiles.victor.name}
        partnerName={profiles.partner.name}
        victorPct={victorPct}
        partnerPct={partnerPct}
        victorBurden={victorBurden}
        partnerBurden={partnerBurden}
      />

      {/* Insight */}
      {!isBalanced && (
        <p className="text-xs-ui text-[var(--t3)] mt-3 leading-relaxed">
          {victorBurden > partnerBurden
            ? `${profiles.victor.name} aporta ${formatCOP(diff)} más. Para equilibrar, su parte del próximo gasto compartido debería ser menor.`
            : `${profiles.partner.name} aporta ${formatCOP(diff)} más. Para equilibrar, su parte del próximo gasto compartido debería ser menor.`
          }
        </p>
      )}
    </div>
  )
}
