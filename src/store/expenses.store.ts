import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense, Category, ProfileId } from '@/core'
import { randomUUID } from '@/lib/uuid'

interface ExpensesState {
  expenses: Expense[]

  // Actions
  addExpense: (data: Omit<Expense, 'id'>) => void
  updateExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  restoreExpense: (expense: Expense) => void
}

export const useExpensesStore = create<ExpensesState>()(
  persist(
    (set) => ({
      expenses: [],

      addExpense: (data) =>
        set((state) => ({
          expenses: [{ ...data, id: randomUUID() }, ...state.expenses],
        })),

      updateExpense: (expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) => e.id === expense.id ? expense : e),
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      restoreExpense: (expense) =>
        set((state) => ({
          expenses: [expense, ...state.expenses],
        })),
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
