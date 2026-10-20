import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import PasoAntecedentes from '@/arbitros/_pasos/paso-antecedentes'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'

jest.mock('@/logica-compartida/hooks/use-registro-arbitro-store')
jest.mock('@/logica-compartida/config/liga', () => ({
  ...jest.requireActual('@/logica-compartida/config/liga'),
  useConfigLiga: () => ({ leagueDisplayName: 'EDeFI' }),
}))

const mockSetRelacion = jest.fn()
const mockSetInstitucion = jest.fn()
const mockEnviarRegistro = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockIrAlPasoAnterior = jest.fn()

const PREGUNTA =
  '¿Tiene o tuvo relación con alguna institución que disputa torneos en la liga EDeFI?'

function mockStore(overrides: Record<string, unknown> = {}) {
  return {
    paso: 4,
    tieneRelacionInstitucional: null,
    institucion: '',
    setTieneRelacionInstitucional: mockSetRelacion,
    setInstitucion: mockSetInstitucion,
    enviarRegistro: mockEnviarRegistro,
    irAlPasoSiguiente: mockIrAlPasoSiguiente,
    irAlPasoAnterior: mockIrAlPasoAnterior,
    ...overrides,
  }
}

describe('PasoAntecedentes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore())
  })

  it('pregunta por la relación institucional y oculta el detalle hasta responder sí', () => {
    render(<PasoAntecedentes />)

    expect(screen.getByText('Antecedentes institucionales')).toBeTruthy()
    expect(screen.getByText(PREGUNTA)).toBeTruthy()
    expect(screen.queryByPlaceholderText('Indicar nombre de la institución')).toBeNull()
    expect(screen.getByTestId('boton-finalizar').props.accessibilityState?.disabled).toBe(true)
  })

  it('pide la institución cuando la respuesta es sí', () => {
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({ tieneRelacionInstitucional: true, institucion: '' })
    )

    render(<PasoAntecedentes />)

    expect(screen.getByPlaceholderText('Indicar nombre de la institución')).toBeTruthy()
    expect(screen.getByTestId('boton-finalizar').props.accessibilityState?.disabled).toBe(true)

    fireEvent.press(screen.getByText('Sí'))
    expect(mockSetRelacion).toHaveBeenCalledWith(true)
  })

  it('avanza cuando el envío sale bien', async () => {
    mockEnviarRegistro.mockResolvedValue({ ok: true })
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({ tieneRelacionInstitucional: false })
    )

    render(<PasoAntecedentes />)
    fireEvent.press(screen.getByTestId('boton-finalizar'))

    await waitFor(() => expect(mockEnviarRegistro).toHaveBeenCalledTimes(1))
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('muestra el error cuando el envío falla', async () => {
    mockEnviarRegistro.mockResolvedValue({ ok: false, error: 'No se pudo registrar' })
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({ tieneRelacionInstitucional: false })
    )

    render(<PasoAntecedentes />)
    fireEvent.press(screen.getByTestId('boton-finalizar'))

    expect(await screen.findByText('No se pudo registrar')).toBeTruthy()
    expect(mockIrAlPasoSiguiente).not.toHaveBeenCalled()
  })

  it('registra no y vuelve al paso anterior', () => {
    render(<PasoAntecedentes />)
    fireEvent.press(screen.getByText('No'))
    fireEvent.press(screen.getByTestId('boton-atras'))
    expect(mockSetRelacion).toHaveBeenCalledWith(false)
    expect(mockIrAlPasoAnterior).toHaveBeenCalledTimes(1)
  })
})
