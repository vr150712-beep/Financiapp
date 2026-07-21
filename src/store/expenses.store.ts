import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense, Category, ProfileId } from '@/core'
import { randomUUID } from '@/lib/uuid'
import { supabase } from '@/lib/supabaseClient'

interface ExpensesState {
  expenses: Expense[]

  // Actions
  addExpense: (data: Omit<Expense, 'id'>) => void
  updateExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  restoreExpense: (expense: Expense) => void
  loadFromSupabase: () => Promise<void>
}

interface ExpenseRow {
  id: string
  owner_id: ProfileId
  label: string
  amount: number
  category: string
  shared: boolean
  my_part: number
  other_part: number
}

function rowToExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    ownerId: row.owner_id,
    label: row.label,
    amount: Number(row.amount),
    category: row.category as Expense['category'],
    shared: row.shared,
    myPart: Number(row.my_part),
    otherPart: Number(row.other_part),
  }
}

function expenseToRow(e: Expense): ExpenseRow {
  return {
    id: e.id,
    owner_id: e.ownerId,
    label: e.label,
    amount: e.amount,
    category: e.category,
    shared: e.shared,
    my_part: e.myPart,
    other_part: e.otherPart,
  }
}

export const useExpensesStore = create<ExpensesState>()(
  persist(
    (set) => ({
      expenses: [],

      addExpense: (data) => {
        const expense = { ...data, id: randomUUID() }
        set((state) => ({
          expenses: [expense, ...state.expenses],
        }))
        supabase.from('expenses').insert(expenseToRow(expense))
          .then(({ error }) => { if (error) console.error('Failed to sync new expense', error) })
      },

      updateExpense: (expense) => {
        set((state) => ({
          expenses: state.expenses.map((e) => e.id === expense.id ? expense : e),
        }))
        supabase.from('expenses').update(expenseToRow(expense)).eq('id', expense.id)
          .then(({ error }) => { if (error) console.error('Failed to sync updated expense', error) })
      },

      removeExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }))
        supabase.from('expenses').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('Failed to sync removed expense', error) })
      },

      restoreExpense: (expense) => {
        set((state) => ({
          expenses: [expense, ...state.expenses],
        }))
        supabase.from('expenses').insert(expenseToRow(expense))
          .then(({ error }) => { if (error) console.error('Failed to sync restored expense', error) })
      },

      loadFromSupabase: async () => {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Failed to load expenses from Supabase', error)
          return
        }
        set({ expenses: (data ?? []).map(rowToExpense) })
      },
    }),
    {
      name: 'finanzas-expenses',
    },
  ),
)

// Selectors
export const selectExpensesByOwner = (expenses: Expense[], ownerId: ProfileId) =>
  expenses.filter((e) => e.ownerId === ownerId)

export const selectExpensesByCategory = (expenses: Expense[], category: Category | 'all') =>
  category === 'all' ? expenses : expenses.filter((e) => e.category === category)

export const selectSharedExpenses = (expenses: Expense[]) =>
  expenses.filter((e) => e.shared)
