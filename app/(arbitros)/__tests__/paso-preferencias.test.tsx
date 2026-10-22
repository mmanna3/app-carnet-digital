import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PasoPreferencias from '@/arbitros/_pasos/paso-preferencias'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'

jest.mock('@/logica-compartida/hooks/use-registro-arbitro-store')

const mockAlternarTorneo = jest.fn()
const mockAlternarFranja = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockIrAlPasoAnterior = jest.fn()

function mockStore(overrides: Record<string, unknown> = {}) {
  return {
    paso: 3,
    torneosInteres: [],
    disponibilidadHoraria: [],
    alternarTorneo: mockAlternarTorneo,
    alternarFranja: mockAlternarFranja,
    irAlPasoSiguiente: mockIrAlPasoSiguiente,
    irAlPasoAnterior: mockIrAlPasoAnterior,
    ...overrides,
  }
}

describe('PasoPreferencias', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore())
  })

  it('muestra torneos y franjas horarias', () => {
    render(<PasoPreferencias />)

    expect(screen.getByTestId('paso-preferencias')).toBeTruthy()
    expect(screen.getByTestId('chip-torneo-BABY FUTBOL')).toBeTruthy()
    expect(screen.getByTestId('chip-franja-SABADOS 8 A 14')).toBeTruthy()
    expect(screen.getByText('Preferencias deportivas')).toBeTruthy()
    expect(screen.getByText('Qué torneos quiere arbitrar y cuándo puede hacerlo')).toBeTruthy()
    expect(screen.getByText('BABY FUTBOL')).toBeTruthy()
    expect(screen.getByText('FUTSAL MASCULINO / MAYORES')).toBeTruthy()
    expect(screen.getByText('FUTSAL FEMENINO')).toBeTruthy()
    expect(screen.getByText('FUTBOL 11')).toBeTruthy()
    expect(screen.getByText('SABADOS 8 A 14')).toBeTruthy()
    expect(screen.getByText('MARTES A VIERNES DE 20 A 23:30')).toBeTruthy()
  })

  it('exige al menos un torneo y una franja para continuar', () => {
    render(<PasoPreferencias />)
    expect(screen.getByTestId('boton-continuar').props.accessibilityState?.disabled).toBe(true)
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({
        torneosInteres: ['FUTBOL 11'],
        disponibilidadHoraria: ['DOMINGOS 9 A 15'],
      })
    )
    screen.unmount()
    render(<PasoPreferencias />)
    fireEvent.press(screen.getByTestId('boton-continuar'))
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('alterna la selección al tocar un torneo y una franja', () => {
    render(<PasoPreferencias />)
    fireEvent.press(screen.getByText('FUTSAL FEMENINO'))
    fireEvent.press(screen.getByText('DOMINGOS 15 A 22'))
    expect(mockAlternarTorneo).toHaveBeenCalledWith('FUTSAL FEMENINO')
    expect(mockAlternarFranja).toHaveBeenCalledWith('DOMINGOS 15 A 22')
  })
})
