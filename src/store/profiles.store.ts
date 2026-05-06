import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, ProfileId, IncomeSource } from '@/core'
import { randomUUID } from '@/lib/uuid'

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
}

const defaultProfiles: Record<ProfileId, Profile> = {
  victor: {
    id: 'victor',
    name: 'Víctor',
    savings: 0,
    color: '#378ADD',
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
    (set) => ({
      profiles: defaultProfiles,
      activeProfileId: 'victor',

      setActiveProfile: (id) =>
        set({ activeProfileId: id }),

      addIncomeSource: (profileId, name, amount) =>
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              ...state.profiles[profileId],
              sources: [
                ...state.profiles[profileId].sources,
                { id: randomUUID(), name, amount },
              ],
            },
          },
        })),

      removeIncomeSource: (profileId, sourceId) =>
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
        })),

      updateIncomeSource: (profileId, source) =>
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
        })),

      updateSavingsTarget: (profileId, savings) =>
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: { ...state.profiles[profileId], savings },
          },
        })),

      updateProfileName: (profileId, name) =>
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: { ...state.profiles[profileId], name },
          },
        })),
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
