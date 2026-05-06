import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '@/core'
import { randomUUID } from '@/lib/uuid'

interface ProjectsState {
  projects: Project[]

  // Actions
  addProject: (data: Omit<Project, 'id'>) => void
  removeProject: (id: string) => void
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],

      addProject: (data) =>
        set((state) => ({
          projects: [{ ...data, id: randomUUID() }, ...state.projects],
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'finanzas-projects',
    },
  ),
)
