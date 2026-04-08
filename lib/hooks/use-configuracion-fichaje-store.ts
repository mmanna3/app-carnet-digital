import { create } from 'zustand'
import { api } from '@/lib/api/api'

interface ConfiguracionFichajeState {
  fichajeEstaHabilitado: boolean | null
  cargando: boolean
  cargarFichajeEstaHabilitado: () => Promise<void>
}

export const useConfiguracionFichajeStore = create<ConfiguracionFichajeState>((set, get) => ({
  fichajeEstaHabilitado: null,
  cargando: false,
  cargarFichajeEstaHabilitado: async () => {
    const eraSinDato = get().fichajeEstaHabilitado === null
    if (eraSinDato && get().cargando) return
    if (eraSinDato) set({ cargando: true })
    try {
      const habilitado = await api.fichajeEstaHabilitado()
      set({ fichajeEstaHabilitado: habilitado })
    } catch {
      if (eraSinDato) {
        set({ fichajeEstaHabilitado: true })
      }
    } finally {
      if (eraSinDato) set({ cargando: false })
    }
  },
}))
