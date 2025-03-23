import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TeamState {
  selectedTeamId: number | null
  setSelectedTeam: (teamId: number) => void
  clearSelectedTeam: () => void
}

export const useTeam = create<TeamState>()(
  persist(
    (set) => ({
      selectedTeamId: null,
      setSelectedTeam: (teamId: number) => set({ selectedTeamId: teamId }),
      clearSelectedTeam: () => set({ selectedTeamId: null }),
    }),
    {
      name: 'team-storage'
    }
  )
) 