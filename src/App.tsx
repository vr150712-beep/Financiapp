import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { AnimatePresence, motion } from 'motion/react'

import { Header }       from '@/components/navigation/Header'
import { BottomNav }    from '@/components/navigation/BottomNav'
import { FAB }          from '@/components/ui/FAB'

import { IncomeSheet }  from '@/components/sheets/IncomeSheet'
import { ExpenseSheet } from '@/components/sheets/ExpenseSheet'
import { ProjectSheet } from '@/components/sheets/ProjectSheet'
import { SettingsSheet }from '@/components/sheets/SettingsSheet'

import { HomeView }             from '@/views/HomeView'
import { AllExpensesView }      from '@/views/AllExpensesView'
import { ProjectsView }         from '@/views/ProjectsView'
import { ProfileSettingsView }  from '@/views/ProfileSettingsView'

import { useProfilesStore } from '@/store'
import { useGreeting }      from '@/hooks'
import type { TabId }       from '@/app/tabs'
import type { ProfileId }   from '@/core'
import type { Expense }     from '@/core'

export default function App() {
  const [tab,               setTab]               = useState<TabId>('home')
  const [activeProfileId,   setActiveProfileId]   = useState<ProfileId>('victor')

  const [incomeOpen,        setIncomeOpen]         = useState(false)
  const [expenseOpen,       setExpenseOpen]        = useState(false)
  const [expenseInitShared, setExpenseInitShared]  = useState(false)
  const [editingExpense,    setEditingExpense]      = useState<Expense | null>(null)
  const [projectOpen,       setProjectOpen]        = useState(false)
  const [settingsOpen,      setSettingsOpen]       = useState(false)

  const setActiveProfile = useProfilesStore((s) => s.setActiveProfile)
  const profiles         = useProfilesStore((s) => s.profiles)
  const greeting         = useGreeting()

  // Keep the Zustand store in sync with the local profile switcher
  useEffect(() => {
    setActiveProfile(activeProfileId)
  }, [activeProfileId, setActiveProfile])

  function handleFAB() {
    setEditingExpense(null)
    if (tab === 'goals') {
      setProjectOpen(true)
    } else if (tab === 'expenses') {
      setExpenseInitShared(false)
      setExpenseOpen(true)
    } else {
      // home
      setExpenseInitShared(false)
      setExpenseOpen(true)
    }
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense)
    setExpenseOpen(true)
  }

  return (
    <>
      <div className="app-shell flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-[var(--bg0)]">
          <Header
            activeTab={tab}
            greeting={greeting}
            onSettings={() => setSettingsOpen(true)}
            activeProfileId={activeProfileId}
            onSwitchProfile={(id) => setActiveProfileId(id)}
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-[72px] pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + activeProfileId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {tab === 'home' && (
                <HomeView
                  activeProfileId={activeProfileId}
                  onEdit={handleEditExpense}
                  onAddIncome={() => setIncomeOpen(true)}
                />
              )}
              {tab === 'expenses' && (
                <AllExpensesView onEdit={handleEditExpense} />
              )}
              {tab === 'goals' && <ProjectsView />}
              {tab === 'profile' && (
                <ProfileSettingsView
                  onEditProfile={() => setSettingsOpen(true)}
                  onEditIncome={() => setIncomeOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <BottomNav active={tab} onChange={setTab} />

        {/* Per-section FAB (not on profile tab) */}
        <AnimatePresence>
          {tab !== 'profile' && (
            <FAB
              key={tab}
              onClick={handleFAB}
              color={
                tab === 'goals'
                  ? 'var(--emerald)'
                  : profiles[activeProfileId].color
              }
              label={tab === 'goals' ? 'Nueva meta' : 'Agregar gasto'}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Sheets */}
      <IncomeSheet   open={incomeOpen}   onClose={() => setIncomeOpen(false)} />
      <ExpenseSheet
        open={expenseOpen}
        onClose={() => { setExpenseOpen(false); setEditingExpense(null) }}
        ownerId={activeProfileId}
        initialShared={expenseInitShared}
        editingExpense={editingExpense}
      />
      <ProjectSheet  open={projectOpen}  onClose={() => setProjectOpen(false)} />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Toasts */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--s2)',
            color: 'var(--t1)',
            border: '0.5px solid var(--s3)',
            borderRadius: '12px',
          },
        }}
      />
    </>
  )
}
