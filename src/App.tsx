import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { AnimatePresence, motion } from 'motion/react'

import { Header }       from '@/components/navigation/Header'
import { BottomNav }    from '@/components/navigation/BottomNav'
import { FAB }          from '@/components/ui/FAB'

import { IncomeSheet }    from '@/components/sheets/IncomeSheet'
import { ExpenseSheet }   from '@/components/sheets/ExpenseSheet'
import { ProjectSheet }   from '@/components/sheets/ProjectSheet'
import { SettingsSheet }  from '@/components/sheets/SettingsSheet'
import { AddChoiceSheet } from '@/components/sheets/AddChoiceSheet'

import { HomeView }             from '@/views/HomeView'
import { ExpensesView }         from '@/views/ExpensesView'
import { ProjectsView }         from '@/views/ProjectsView'
import { ProfileSettingsView }  from '@/views/ProfileSettingsView'

import { useProfilesStore } from '@/store'
import { useGreeting }      from '@/hooks'
import { getTabConfig }     from '@/app/tabs'
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
  const [addChoiceOpen,     setAddChoiceOpen]      = useState(false)

  const setActiveProfile = useProfilesStore((s) => s.setActiveProfile)
  const greeting         = useGreeting()
  const tabConfig        = getTabConfig(tab)

  // Keep the Zustand store in sync with the local profile switcher
  useEffect(() => {
    setActiveProfile(activeProfileId)
  }, [activeProfileId, setActiveProfile])

  function handleFAB() {
    setEditingExpense(null)
    if (tab === 'goals') {
      setProjectOpen(true)
    } else if (tab === 'home') {
      setAddChoiceOpen(true)
    } else {
      setExpenseInitShared(false)
      setExpenseOpen(true)
    }
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense)
    setExpenseOpen(true)
  }

  function handleChooseExpense() {
    setAddChoiceOpen(false)
    setExpenseInitShared(false)
    setExpenseOpen(true)
  }

  function handleChooseProject() {
    setAddChoiceOpen(false)
    setProjectOpen(true)
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
        <div
          className="flex-1 overflow-y-auto pt-2"
          style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}
        >
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
                <ExpensesView profileId={activeProfileId} onEdit={handleEditExpense} showSummary />
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

        {/* Per-section FAB */}
        <AnimatePresence>
          {tabConfig.showFab && (
            <FAB
              key={tab}
              onClick={handleFAB}
              label={tabConfig.fabLabel}
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
      <AddChoiceSheet
        open={addChoiceOpen}
        onClose={() => setAddChoiceOpen(false)}
        onChooseExpense={handleChooseExpense}
        onChooseProject={handleChooseProject}
      />

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
