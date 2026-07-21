import { WellnessWidget }     from '@/components/widgets/WellnessWidget'
import { ExpensesView }       from '@/views/ExpensesView'
import { useProfilesStore }   from '@/store'
import type { ProfileId }     from '@/core'
import type { Expense }       from '@/core'

interface ProfileViewProps {
  profileId:  ProfileId
  onAddIncome: () => void
  onEdit:     (expense: Expense) => void
}

export function ProfileView({ profileId, onAddIncome, onEdit }: ProfileViewProps) {
  const profile = useProfilesStore((s) => s.profiles[profileId])

  return (
    <div className="flex flex-col pb-4">
      {/* Widget cards */}
      <div className="flex flex-col gap-4 px-4 mb-2">
        <WellnessWidget
          profileId={profileId}
          profileName={profile.name}
          onAddIncome={onAddIncome}
        />
      </div>

      {/* Expense list — manages its own px-4 */}
      <ExpensesView profileId={profileId} onEdit={onEdit} />
    </div>
  )
}
