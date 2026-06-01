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
      equipoSeleccionadoCodigo: null,
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
    it('guarda id, nombre y código correctamente', () => {
      useEquipoStore.getState().seleccionarEquipo(42, 'Deportivo Luefi', 'ABC1234')

      const { equipoSeleccionadoId, equipoSeleccionadoNombre, equipoSeleccionadoCodigo } =
        useEquipoStore.getState()
      expect(equipoSeleccionadoId).toBe(42)
      expect(equipoSeleccionadoNombre).toBe('Deportivo Luefi')
      expect(equipoSeleccionadoCodigo).toBe('ABC1234')
    })

    it('reemplaza el equipo previamente seleccionado', () => {
      useEquipoStore.getState().seleccionarEquipo(1, 'Primero', 'AAA0001')
      useEquipoStore.getState().seleccionarEquipo(2, 'Segundo', 'BBB0002')

      const { equipoSeleccionadoId, equipoSeleccionadoNombre, equipoSeleccionadoCodigo } =
        useEquipoStore.getState()
      expect(equipoSeleccionadoId).toBe(2)
      expect(equipoSeleccionadoNombre).toBe('Segundo')
      expect(equipoSeleccionadoCodigo).toBe('BBB0002')
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
