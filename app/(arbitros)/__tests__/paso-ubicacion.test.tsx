import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PasoUbicacion from '@/arbitros/_pasos/paso-ubicacion'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'

jest.mock('@/logica-compartida/hooks/use-registro-arbitro-store')
jest.mock('@/fichaje-jugador/_components/modal-fecha-nacimiento', () => {
  const { View } = require('react-native')
  return function MockModalFechaNacimiento() {
    return <View testID="modal-fecha-nacimiento-mock" />
  }
})

const mockSetDireccion = jest.fn()
const mockSetLocalidad = jest.fn()
const mockSetTipoMovilidad = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockIrAlPasoAnterior = jest.fn()

function mockStore(overrides: Record<string, unknown> = {}) {
  return {
    paso: 2,
    direccion: '',
    localidad: '',
    fechaNacimiento: null,
    tipoMovilidad: null,
    setDireccion: mockSetDireccion,
    setLocalidad: mockSetLocalidad,
    setFechaNacimiento: jest.fn(),
    setTipoMovilidad: mockSetTipoMovilidad,
    irAlPasoSiguiente: mockIrAlPasoSiguiente,
    irAlPasoAnterior: mockIrAlPasoAnterior,
    ...overrides,
  }
}

describe('PasoUbicacion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore())
  })

  it('muestra ubicación, fecha y las opciones de movilidad', () => {
    render(<PasoUbicacion />)

    expect(screen.getByText('Ubicación y movilidad')).toBeTruthy()
    expect(screen.getByText('Dónde vive y cómo se traslada')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá la dirección')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá la localidad')).toBeTruthy()
    expect(screen.getByText('Seleccioná la fecha de nacimiento')).toBeTruthy()
    expect(screen.getByText('MOTO')).toBeTruthy()
    expect(screen.getByText('AUTO')).toBeTruthy()
    expect(screen.getByText('BICICLETA')).toBeTruthy()
    expect(screen.getByText('TRANSPORTE PUBLICO')).toBeTruthy()
  })

  it('exige localidad y tipo de movilidad para continuar', () => {
    render(<PasoUbicacion />)
    expect(screen.getByTestId('boton-continuar').props.accessibilityState?.disabled).toBe(true)
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({
        direccion: 'Calle 1',
        localidad: 'Quilmes',
        fechaNacimiento: new Date(1990, 0, 1),
        tipoMovilidad: 'MOTO',
      })
    )
    screen.unmount()
    render(<PasoUbicacion />)

    fireEvent.press(screen.getByTestId('boton-continuar'))
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('elige un tipo de movilidad', () => {
    render(<PasoUbicacion />)
    fireEvent.press(screen.getByText('BICICLETA'))
    expect(mockSetTipoMovilidad).toHaveBeenCalledWith('BICICLETA')
  })

  it('vuelve al paso anterior', () => {
    render(<PasoUbicacion />)
    fireEvent.press(screen.getByTestId('boton-atras'))
    expect(mockIrAlPasoAnterior).toHaveBeenCalledTimes(1)
  })
})
