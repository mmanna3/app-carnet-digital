import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EquipoState {
  equipoSeleccionadoId: number | null
  equipoSeleccionadoNombre: string | null
  seleccionarEquipo: (id: number, nombre: string) => void
  limpiarEquipoSeleccionado: () => void
}

export const useEquipoStore = create<EquipoState>()(
  persist(
    (set) => ({
      equipoSeleccionadoId: null,
      equipoSeleccionadoNombre: null,
      seleccionarEquipo: (id: number, nombre: string) =>
        set({
          equipoSeleccionadoId: id,
          equipoSeleccionadoNombre: nombre,
        }),
      limpiarEquipoSeleccionado: () =>
        set({
          equipoSeleccionadoId: null,
          equipoSeleccionadoNombre: null,
        }),
    }),
    {
      name: 'equipo-storage',
    }
  )
)

export default useEquipoStore
