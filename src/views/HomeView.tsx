import { WellnessWidget }     from '@/components/widgets/WellnessWidget'
import { DistributionWidget } from '@/components/widgets/DistributionWidget'
import { ExpensesView }       from '@/views/ExpensesView'
import type { ProfileId }     from '@/core'
import type { Expense }       from '@/core'

interface HomeViewProps {
  activeProfileId: ProfileId
  onEdit: (expense: Expense) => void
  onAddIncome: () => void
}

export function HomeView({ activeProfileId, onEdit, onAddIncome }: HomeViewProps) {
  return (
    <div className="flex flex-col pb-4">
      <div className="flex flex-col gap-3 px-4 mb-2">
        <WellnessWidget
          profileId={activeProfileId}
          profileName=""   /* name shown in header, not repeated in widget */
          onAddIncome={onAddIncome}
        />
        <DistributionWidget profileId={activeProfileId} />
      </div>

      <ExpensesView profileId={activeProfileId} onEdit={onEdit} />
    </div>
  )
}
