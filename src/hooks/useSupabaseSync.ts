import { useEffect } from 'react'
import { useProfilesStore } from '@/store/profiles.store'
import { useExpensesStore } from '@/store/expenses.store'
import { useProjectsStore } from '@/store/projects.store'

function refetchAll() {
  useProfilesStore.getState().loadFromSupabase()
  useExpensesStore.getState().loadFromSupabase()
  useProjectsStore.getState().loadFromSupabase()
}

export function useSupabaseSync() {
  useEffect(() => {
    refetchAll()

    function onVisibility() {
      if (document.visibilityState === 'visible') refetchAll()
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', refetchAll)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', refetchAll)
    }
  }, [])
}
