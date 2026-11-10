import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PasoAntecedentes from '@/arbitros/_pasos/paso-antecedentes'
import { ApiException } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'

jest.mock('@/lib/api/api', () => ({ api: { registroArbitro: jest.fn() } }))
jest.mock('@/logica-compartida/config/liga', () => ({
  ...jest.requireActual('@/logica-compartida/config/liga'),
  useConfigLiga: () => ({ leagueDisplayName: 'EDeFI' }),
}))

describe('envío del registro de árbitro (store real)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useRegistroArbitroStore.getState().resetear()
    useRegistroArbitroStore.setState({
      paso: 4,
      dni: '30111222',
      apellido: 'Gomez',
      nombre: 'Ana',
      telefonoCelular: '99887766',
      direccion: 'Mitre 10',
      localidad: 'Bernal',
      fechaNacimiento: new Date(1990, 4, 2),
      tipoMovilidad: 2,
      torneoAgrupadorIds: [11],
      franjasHorarias: [1],
      tieneRelacionInstitucional: false,
    })
  })

  it('muestra en el paso 4 el 400 del back por DNI duplicado y no avanza', async () => {
    ;(api.registroArbitro as jest.Mock).mockRejectedValue(
      new ApiException(
        'An unexpected server error occurred.',
        400,
        JSON.stringify({ status: 400, title: 'Ya hay un árbitro registrado con ese DNI' }),
        {},
        null
      )
    )
    render(<PasoAntecedentes />)

    fireEvent.press(screen.getByTestId('boton-finalizar'))

    expect(await screen.findByText('Ya hay un árbitro registrado con ese DNI')).toBeTruthy()
    expect(useRegistroArbitroStore.getState().paso).toBe(4)
  })

  it('avanza al completado cuando el back acepta el alta', async () => {
    ;(api.registroArbitro as jest.Mock).mockResolvedValue(7)
    render(<PasoAntecedentes />)

    fireEvent.press(screen.getByTestId('boton-finalizar'))

    await screen.findByTestId('boton-finalizar')
    await new Promise((r) => setTimeout(r, 0))
    expect(useRegistroArbitroStore.getState().paso).toBe(5)
  })
})
