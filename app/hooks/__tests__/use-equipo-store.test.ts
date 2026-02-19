// Elimina la capa de persistencia para tests
jest.mock('zustand/middleware', () => ({
  ...jest.requireActual('zustand/middleware'),
  persist: (config: any) => config,
}))

import { useEquipoStore } from '../use-equipo-store'

describe('useEquipoStore', () => {
  beforeEach(() => {
    useEquipoStore.setState({
      equipoSeleccionadoId: null,
      equipoSeleccionadoNombre: null,
    })
  })

  describe('estado inicial', () => {
    it('id y nombre son null', () => {
      const { equipoSeleccionadoId, equipoSeleccionadoNombre } = useEquipoStore.getState()
      expect(equipoSeleccionadoId).toBeNull()
      expect(equipoSeleccionadoNombre).toBeNull()
    })
  })

  describe('seleccionarEquipo', () => {
    it('guarda id y nombre correctamente', () => {
      useEquipoStore.getState().seleccionarEquipo(42, 'Deportivo Luefi')

      const { equipoSeleccionadoId, equipoSeleccionadoNombre } = useEquipoStore.getState()
      expect(equipoSeleccionadoId).toBe(42)
      expect(equipoSeleccionadoNombre).toBe('Deportivo Luefi')
    })

    it('reemplaza el equipo previamente seleccionado', () => {
      useEquipoStore.getState().seleccionarEquipo(1, 'Primero')
      useEquipoStore.getState().seleccionarEquipo(2, 'Segundo')

      const { equipoSeleccionadoId, equipoSeleccionadoNombre } = useEquipoStore.getState()
      expect(equipoSeleccionadoId).toBe(2)
      expect(equipoSeleccionadoNombre).toBe('Segundo')
    })
  })

  describe('limpiarEquipoSeleccionado', () => {
    it('resetea id y nombre a null', () => {
      useEquipoStore.setState({ equipoSeleccionadoId: 42, equipoSeleccionadoNombre: 'Luefi' })

      useEquipoStore.getState().limpiarEquipoSeleccionado()

      const { equipoSeleccionadoId, equipoSeleccionadoNombre } = useEquipoStore.getState()
      expect(equipoSeleccionadoId).toBeNull()
      expect(equipoSeleccionadoNombre).toBeNull()
    })
  })
})
