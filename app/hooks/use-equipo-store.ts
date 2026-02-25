import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zustandStorage } from '@/lib/storage/zustand-storage'

interface EquipoState {
  equipoSeleccionadoId: number | null
  equipoSeleccionadoNombre: string | null
  equipoSeleccionadoCodigo: string | null
  seleccionarEquipo: (id: number, nombre: string, codigo: string) => void
  limpiarEquipoSeleccionado: () => void
}

export const useEquipoStore = create<EquipoState>()(
  persist(
    (set) => ({
      equipoSeleccionadoId: null,
      equipoSeleccionadoNombre: null,
      equipoSeleccionadoCodigo: null,
      seleccionarEquipo: (id: number, nombre: string, codigo: string) =>
        set({
          equipoSeleccionadoId: id,
          equipoSeleccionadoNombre: nombre,
          equipoSeleccionadoCodigo: codigo,
        }),
      limpiarEquipoSeleccionado: () =>
        set({
          equipoSeleccionadoId: null,
          equipoSeleccionadoNombre: null,
          equipoSeleccionadoCodigo: null,
        }),
    }),
    {
      name: 'equipo-storage',
      storage: zustandStorage,
    }
  )
)

export default useEquipoStore
