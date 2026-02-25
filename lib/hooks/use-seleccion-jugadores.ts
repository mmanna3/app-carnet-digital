import { create } from 'zustand'

interface SeleccionState {
  modoSeleccion: boolean
  jugadoresSeleccionados: number[]
  activar: () => void
  desactivar: () => void
  toggle: (id: number) => void
  limpiar: () => void
}

export const useSeleccionJugadores = create<SeleccionState>()((set) => ({
  modoSeleccion: false,
  jugadoresSeleccionados: [],
  activar: () => set({ modoSeleccion: true, jugadoresSeleccionados: [] }),
  desactivar: () => set({ modoSeleccion: false, jugadoresSeleccionados: [] }),
  toggle: (id) =>
    set((s) => ({
      jugadoresSeleccionados: s.jugadoresSeleccionados.includes(id)
        ? s.jugadoresSeleccionados.filter((x) => x !== id)
        : [...s.jugadoresSeleccionados, id],
    })),
  limpiar: () => set({ jugadoresSeleccionados: [] }),
}))
