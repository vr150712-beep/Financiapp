import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, ProfileId, IncomeSource } from '@/core'
import { randomUUID } from '@/lib/uuid'
import { supabase } from '@/lib/supabaseClient'

interface ProfilesState {
  profiles: Record<ProfileId, Profile>
  activeProfileId: ProfileId

  // Actions
  setActiveProfile: (id: ProfileId) => void
  addIncomeSource: (profileId: ProfileId, name: string, amount: number) => void
  removeIncomeSource: (profileId: ProfileId, sourceId: string) => void
  updateIncomeSource: (profileId: ProfileId, source: IncomeSource) => void
  updateSavingsTarget: (profileId: ProfileId, savings: number) => void
  updateProfileName: (profileId: ProfileId, name: string) => void
  loadFromSupabase: () => Promise<void>
}

const defaultProfiles: Record<ProfileId, Profile> = {
  victor: {
    id: 'victor',
    name: 'Víctor',
    savings: 0,
    color: '#38BDF8',
    sources: [],
  },
  partner: {
    id: 'partner',
    name: 'Camila',
    savings: 0,
    color: '#D4537E',
    sources: [],
  },
}

export const useProfilesStore = create<ProfilesState>()(
  persist(
    (set, get) => ({
      profiles: defaultProfiles,
      activeProfileId: 'victor',

      setActiveProfile: (id) =>
        set({ activeProfileId: id }),

      addIncomeSource: (profileId, name, amount) => {
        const id = randomUUID()
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              ...state.profiles[profileId],
              sources: [
                ...state.profiles[profileId].sources,
                { id, name, amount },
              ],
            },
          },
        }))
        supabase.from('income_sources').insert({ id, profile_id: profileId, name, amount })
          .then(({ error }) => { if (error) console.error('Failed to sync new income source', error) })
      },

      removeIncomeSource: (profileId, sourceId) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              ...state.profiles[profileId],
              sources: state.profiles[profileId].sources.filter(
                (s) => s.id !== sourceId,
              ),
            },
          },
        }))
        supabase.from('income_sources').delete().eq('id', sourceId)
          .then(({ error }) => { if (error) console.error('Failed to sync removed income source', error) })
      },

      updateIncomeSource: (profileId, source) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              ...state.profiles[profileId],
              sources: state.profiles[profileId].sources.map((s) =>
                s.id === source.id ? source : s,
              ),
            },
          },
        }))
        supabase.from('income_sources').update({ name: source.name, amount: source.amount }).eq('id', source.id)
          .then(({ error }) => { if (error) console.error('Failed to sync updated income source', error) })
      },

      updateSavingsTarget: (profileId, savings) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: { ...state.profiles[profileId], savings },
          },
        }))
        supabase.from('profiles').update({ savings }).eq('id', profileId)
          .then(({ error }) => { if (error) console.error('Failed to sync savings target', error) })
      },

      updateProfileName: (profileId, name) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: { ...state.profiles[profileId], name },
          },
        }))
        supabase.from('profiles').update({ name }).eq('id', profileId)
          .then(({ error }) => { if (error) console.error('Failed to sync profile name', error) })
      },

      loadFromSupabase: async () => {
        const [{ data: profileRows, error: profileErr }, { data: sourceRows, error: sourceErr }] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('income_sources').select('*'),
        ])

        if (profileErr || sourceErr) {
          console.error('Failed to load profiles from Supabase', profileErr ?? sourceErr)
          return
        }
        if (!profileRows || profileRows.length === 0) return

        const next: Record<ProfileId, Profile> = { ...get().profiles }
        for (const row of profileRows) {
          const id = row.id as ProfileId
          next[id] = {
            id,
            name: row.name,
            savings: Number(row.savings),
            color: row.color,
            sources: (sourceRows ?? [])
              .filter((s) => s.profile_id === id)
              .map((s) => ({ id: s.id, name: s.name, amount: Number(s.amount) })),
          }
        }
        set({ profiles: next })
      },
    }),
    {
      name: 'finanzas-profiles',
      partialize: (state) => ({ profiles: state.profiles }),
    },
  ),
)

// Selectors
export const selectActiveProfile = (state: ProfilesState) =>
  state.profiles[state.activeProfileId]

export const selectProfileIncome = (profile: Profile) =>
  profile.sources.reduce((sum, s) => sum + s.amount, 0)
