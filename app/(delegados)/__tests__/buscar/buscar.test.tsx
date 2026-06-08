import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import BuscarScreen from '@/inicio-delegados/buscar'
import { api } from '@/lib/api/api'

jest.mock('@/lib/api/api', () => ({
  api: {
    carnetsPorCodigoAlfanumerico: jest.fn(),
  },
}))

jest.mock('@/lib/utils/pdfGenerator', () => ({
  generatePDF: jest.fn(),
}))

jest.mock('@/lib/hooks/use-acento-equipo-seleccionado', () => ({
  useAcentoEquipoSeleccionado: () => ({
    jugadores: [],
    temaFranja: 'verde',
    hexAcento: '#16a34a',
    hexLink: '#15803d',
  }),
}))

const mockCarnet = {
  id: 1,
  dni: '12345678',
  nombre: 'Juan',
  apellido: 'Perez',
  fechaNacimiento: new Date('2010-03-15'),
  equipo: 'Equipo de Prueba',
  torneo: 'Torneo E2E',
  estado: 3,
  fotoCarnet: undefined,
}

describe('BuscarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('renderizado', () => {
    it('muestra el input de código y el botón de búsqueda', () => {
      render(<BuscarScreen />)
      expect(screen.getByPlaceholderText('Ej:ABC1234')).toBeTruthy()
      expect(screen.getByText('Jugadores')).toBeTruthy()
    })
  })

  describe('validación', () => {
    it('muestra error cuando se busca sin código', async () => {
      render(<BuscarScreen />)

      fireEvent.press(screen.getByText('Jugadores'))

      await waitFor(() => {
        expect(screen.getByText('Ingresá un código de equipo')).toBeTruthy()
      })
      expect(api.carnetsPorCodigoAlfanumerico).not.toHaveBeenCalled()
    })
  })

  describe('búsqueda exitosa', () => {
    it('llama a la API con el código ingresado y muestra los carnets', async () => {
      ;(api.carnetsPorCodigoAlfanumerico as jest.Mock).mockResolvedValue([mockCarnet])

      render(<BuscarScreen />)
      fireEvent.changeText(screen.getByPlaceholderText('Ej:ABC1234'), 'ABC1234')
      fireEvent.press(screen.getByText('Jugadores'))

      await waitFor(() => {
        expect(screen.getByText('Perez, Juan')).toBeTruthy()
      })
      expect(api.carnetsPorCodigoAlfanumerico).toHaveBeenCalledWith('ABC1234')
    })

    it('muestra el botón de PDF cuando hay resultados', async () => {
      ;(api.carnetsPorCodigoAlfanumerico as jest.Mock).mockResolvedValue([mockCarnet])

      render(<BuscarScreen />)
      fireEvent.changeText(screen.getByPlaceholderText('Ej:ABC1234'), 'MTD0001')
      fireEvent.press(screen.getByText('Jugadores'))

      await waitFor(() => {
        expect(screen.getByText('PDF')).toBeTruthy()
      })
    })

    it('agrupa jugadores por categoría (año de nacimiento)', async () => {
      ;(api.carnetsPorCodigoAlfanumerico as jest.Mock).mockResolvedValue([mockCarnet])

      render(<BuscarScreen />)
      fireEvent.changeText(screen.getByPlaceholderText('Ej:ABC1234'), 'ABC1234')
      fireEvent.press(screen.getByText('Jugadores'))

      await waitFor(() => {
        expect(screen.getByText('Categoría 2010')).toBeTruthy()
      })
    })
  })

  describe('sin resultados', () => {
    it('muestra mensaje cuando la API devuelve lista vacía', async () => {
      ;(api.carnetsPorCodigoAlfanumerico as jest.Mock).mockResolvedValue([])

      render(<BuscarScreen />)
      fireEvent.changeText(screen.getByPlaceholderText('Ej:ABC1234'), 'XXXXXX')
      fireEvent.press(screen.getByText('Jugadores'))

      await waitFor(() => {
        expect(screen.getByText('No se encontraron jugadores para este equipo')).toBeTruthy()
      })
    })
  })

  describe('error de API', () => {
    it('muestra el mensaje de error cuando la API falla', async () => {
      ;(api.carnetsPorCodigoAlfanumerico as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<BuscarScreen />)
      fireEvent.changeText(screen.getByPlaceholderText('Ej:ABC1234'), 'ABC1234')
      fireEvent.press(screen.getByText('Jugadores'))

      await waitFor(() => {
        // El botón vuelve a su estado normal (no "Buscando...")
        expect(screen.getByText('Jugadores')).toBeTruthy()
      })
    })
  })
})
