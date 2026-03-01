import React from 'react'
import { render, screen } from '@testing-library/react-native'
import PendientesScreen from '../pendientes'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'

jest.mock('@/lib/hooks/use-equipo-store')
jest.mock('@/lib/api/custom-hooks/use-api-query')
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => ({ refetchQueries: jest.fn() }),
}))

const mockJugadorPendiente = {
  id: 2,
  dni: '99887766',
  nombre: 'Maria',
  apellido: 'Garcia',
  fechaNacimiento: new Date('2008-06-20'),
  equipo: 'Equipo de Prueba',
  torneo: 'Torneo E2E',
  estado: 1, // FichajePendienteDeAprobacion
  fotoCarnet: undefined,
}

const mockJugadorRechazado = {
  id: 3,
  dni: '11223344',
  nombre: 'Pedro',
  apellido: 'Lopez',
  fechaNacimiento: new Date('2009-01-10'),
  equipo: 'Equipo de Prueba',
  torneo: 'Torneo E2E',
  estado: 2, // FichajeRechazado
  motivo: 'Documentación incompleta',
  fotoCarnet: undefined,
}

const mockJugadorAprobadoPendienteDePago = {
  id: 4,
  dni: '55443322',
  nombre: 'Ana',
  apellido: 'Martinez',
  fechaNacimiento: new Date('2007-05-01'),
  equipo: 'Equipo de Prueba',
  torneo: 'Torneo E2E',
  estado: 6, // AprobadoPendienteDePago
  fotoCarnet: undefined,
}

describe('PendientesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useEquipoStore as unknown as jest.Mock).mockReturnValue({ equipoSeleccionadoId: 1 })
    ;(useApiQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false, isError: false })
  })

  describe('sin equipo seleccionado', () => {
    it('muestra mensaje pidiendo seleccionar equipo', () => {
      ;(useEquipoStore as unknown as jest.Mock).mockReturnValue({ equipoSeleccionadoId: null })

      render(<PendientesScreen />)

      expect(screen.getByText('Debes seleccionar un equipo primero')).toBeTruthy()
    })
  })

  describe('estados de carga', () => {
    it('muestra indicador de carga mientras obtiene datos', () => {
      ;(useApiQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })

      render(<PendientesScreen />)

      expect(screen.getByText('Cargando jugadores...')).toBeTruthy()
    })

    it('muestra mensaje de error cuando la query falla', () => {
      ;(useApiQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
      })

      render(<PendientesScreen />)

      expect(screen.getByText('Error al cargar los jugadores pendientes.')).toBeTruthy()
    })
  })

  describe('sin pendientes', () => {
    it('muestra mensaje cuando no hay jugadores pendientes', () => {
      render(<PendientesScreen />)

      expect(screen.getByText('No hay jugadores pendientes')).toBeTruthy()
    })
  })

  describe('jugadores pendientes de aprobación', () => {
    it('muestra la sección "Pendientes de Aprobación" con el jugador', () => {
      ;(useApiQuery as jest.Mock).mockReturnValue({
        data: [mockJugadorPendiente],
        isLoading: false,
        isError: false,
      })

      render(<PendientesScreen />)

      expect(screen.getByText('Pendientes de Aprobación')).toBeTruthy()
      expect(screen.getByText('Maria')).toBeTruthy()
    })
  })

  describe('jugadores rechazados', () => {
    it('muestra la sección "Fichajes Rechazados" con el jugador y el motivo', () => {
      ;(useApiQuery as jest.Mock).mockReturnValue({
        data: [mockJugadorRechazado],
        isLoading: false,
        isError: false,
      })

      render(<PendientesScreen />)

      expect(screen.getByText('Fichajes Rechazados')).toBeTruthy()
      expect(screen.getByText('Pedro')).toBeTruthy()
      expect(screen.getByText('Documentación incompleta')).toBeTruthy()
    })
  })

  describe('jugadores aprobados pendientes de pago', () => {
    it('muestra la sección "Pendientes de Pago" con el jugador', () => {
      ;(useApiQuery as jest.Mock).mockReturnValue({
        data: [mockJugadorAprobadoPendienteDePago],
        isLoading: false,
        isError: false,
      })

      render(<PendientesScreen />)

      expect(screen.getByText('Pendientes de Pago')).toBeTruthy()
      expect(screen.getByText('Ana')).toBeTruthy()
    })
  })

  describe('múltiples secciones', () => {
    it('muestra todas las secciones cuando hay jugadores de distintos estados', () => {
      ;(useApiQuery as jest.Mock).mockReturnValue({
        data: [mockJugadorPendiente, mockJugadorRechazado, mockJugadorAprobadoPendienteDePago],
        isLoading: false,
        isError: false,
      })

      render(<PendientesScreen />)

      expect(screen.getByText('Fichajes Rechazados')).toBeTruthy()
      expect(screen.getByText('Pendientes de Pago')).toBeTruthy()
      expect(screen.getByText('Pendientes de Aprobación')).toBeTruthy()
    })
  })
})
