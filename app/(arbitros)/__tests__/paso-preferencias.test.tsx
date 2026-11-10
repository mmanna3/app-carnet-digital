import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PasoPreferencias from '@/arbitros/_pasos/paso-preferencias'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { useTorneosParaArbitros } from '@/arbitros/_logica/use-torneos-para-arbitros'

jest.mock('@/logica-compartida/hooks/use-registro-arbitro-store')
jest.mock('@/arbitros/_logica/use-torneos-para-arbitros')

const mockAlternarTorneo = jest.fn()
const mockAlternarFranja = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockIrAlPasoAnterior = jest.fn()
const mockReintentar = jest.fn()

const TORNEOS = [
  { id: 11, nombre: 'BABY FUTBOL' },
  { id: 12, nombre: 'FUTBOL 11' },
]

function mockStore(overrides: Record<string, unknown> = {}) {
  return {
    paso: 3,
    torneoAgrupadorIds: [],
    franjasHorarias: [],
    alternarTorneo: mockAlternarTorneo,
    alternarFranja: mockAlternarFranja,
    irAlPasoSiguiente: mockIrAlPasoSiguiente,
    irAlPasoAnterior: mockIrAlPasoAnterior,
    ...overrides,
  }
}

function mockTorneos(overrides: Record<string, unknown> = {}) {
  ;(useTorneosParaArbitros as jest.Mock).mockReturnValue({
    torneos: TORNEOS,
    cargando: false,
    huboError: false,
    reintentar: mockReintentar,
    ...overrides,
  })
}

describe('PasoPreferencias', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore())
    mockTorneos()
  })

  it('muestra los torneos del back y las franjas horarias', () => {
    render(<PasoPreferencias />)

    expect(screen.getByTestId('paso-preferencias')).toBeTruthy()
    expect(screen.getByTestId('chip-torneo-11')).toBeTruthy()
    expect(screen.getByTestId('chip-franja-1')).toBeTruthy()
    expect(screen.getByText('Preferencias deportivas')).toBeTruthy()
    expect(screen.getByText('BABY FUTBOL')).toBeTruthy()
    expect(screen.getByText('FUTBOL 11')).toBeTruthy()
    expect(screen.getByText('SABADOS 8 A 14')).toBeTruthy()
    expect(screen.getByText('MARTES A VIERNES DE 20 A 23:30')).toBeTruthy()
  })

  it('exige al menos un torneo y una franja para continuar', () => {
    render(<PasoPreferencias />)
    expect(screen.getByTestId('boton-continuar').props.accessibilityState?.disabled).toBe(true)
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({ torneoAgrupadorIds: [12], franjasHorarias: [3] })
    )
    screen.unmount()
    render(<PasoPreferencias />)
    fireEvent.press(screen.getByTestId('boton-continuar'))
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('alterna la selección al tocar un torneo y una franja', () => {
    render(<PasoPreferencias />)
    fireEvent.press(screen.getByTestId('chip-torneo-12'))
    fireEvent.press(screen.getByTestId('chip-franja-4'))
    expect(mockAlternarTorneo).toHaveBeenCalledWith(12)
    expect(mockAlternarFranja).toHaveBeenCalledWith(4)
  })

  it('muestra un spinner mientras cargan los torneos', () => {
    mockTorneos({ torneos: [], cargando: true })
    render(<PasoPreferencias />)
    expect(screen.getByTestId('torneos-cargando')).toBeTruthy()
    expect(screen.queryByTestId('chip-torneo-11')).toBeNull()
  })

  it('muestra el error y reintenta la carga', () => {
    mockTorneos({ torneos: [], huboError: true })
    render(<PasoPreferencias />)
    expect(screen.getByTestId('torneos-error')).toBeTruthy()
    fireEvent.press(screen.getByTestId('boton-reintentar-torneos'))
    expect(mockReintentar).toHaveBeenCalledTimes(1)
  })

  it('avisa si no hay torneos y no deja avanzar', () => {
    mockTorneos({ torneos: [] })
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({ torneoAgrupadorIds: [11], franjasHorarias: [3] })
    )
    render(<PasoPreferencias />)
    expect(screen.getByTestId('torneos-vacios')).toBeTruthy()
    expect(screen.getByTestId('boton-continuar').props.accessibilityState?.disabled).toBe(true)
  })
})
