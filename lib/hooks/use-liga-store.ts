import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zustandStorage } from '@/lib/storage/zustand-storage'

interface LigaState {
  ligaSeleccionadaId: string | null
  seleccionarLiga: (id: string) => void
  limpiarLiga: () => void
}

export const useLigaStore = create<LigaState>()(
  persist(
    (set) => ({
      ligaSeleccionadaId: null,
      seleccionarLiga: (id: string) => set({ ligaSeleccionadaId: id }),
      limpiarLiga: () => set({ ligaSeleccionadaId: null }),
    }),
    { name: 'liga-storage', storage: zustandStorage }
  )
)
