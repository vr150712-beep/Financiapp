import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '@/core'
import { randomUUID } from '@/lib/uuid'
import { supabase } from '@/lib/supabaseClient'

interface ProjectRow {
  id: string
  label: string
  amount: number
  months: number
  note: string | null
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    label: row.label,
    amount: Number(row.amount),
    months: row.months,
    note: row.note ?? undefined,
  }
}

function projectToRow(p: Project): ProjectRow {
  return {
    id: p.id,
    label: p.label,
    amount: p.amount,
    months: p.months,
    note: p.note ?? null,
  }
}

interface ProjectsState {
  projects: Project[]

  // Actions
  addProject: (data: Omit<Project, 'id'>) => void
  removeProject: (id: string) => void
  loadFromSupabase: () => Promise<void>
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],

      addProject: (data) => {
        const project = { ...data, id: randomUUID() }
        set((state) => ({
          projects: [project, ...state.projects],
        }))
        supabase.from('projects').insert(projectToRow(project))
          .then(({ error }) => { if (error) console.error('Failed to sync new project', error) })
      },

      removeProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }))
        supabase.from('projects').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('Failed to sync removed project', error) })
      },

      loadFromSupabase: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Failed to load projects from Supabase', error)
          return
        }
        set({ projects: (data ?? []).map(rowToProject) })
      },
    }),
    {
      name: 'finanzas-projects',
    },
  ),
)
