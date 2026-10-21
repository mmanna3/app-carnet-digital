import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PasoUbicacion from '@/arbitros/_pasos/paso-ubicacion'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'

jest.mock('@/logica-compartida/hooks/use-registro-arbitro-store')

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
    tipoMovilidad: null,
    setDireccion: mockSetDireccion,
    setLocalidad: mockSetLocalidad,
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

  it('muestra ubicación y las opciones de movilidad', () => {
    render(<PasoUbicacion />)

    expect(screen.getByTestId('paso-ubicacion')).toBeTruthy()
    expect(screen.getByText('Ubicación y movilidad')).toBeTruthy()
    expect(screen.getByText('Dónde vive y cómo se traslada')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá la dirección')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá la localidad')).toBeTruthy()
    expect(screen.queryByText('Seleccioná la fecha de nacimiento')).toBeNull()
    expect(screen.getByTestId('chip-movilidad-MOTO')).toBeTruthy()
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
    fireEvent.press(screen.getByTestId('chip-movilidad-BICICLETA'))
    expect(mockSetTipoMovilidad).toHaveBeenCalledWith('BICICLETA')
  })

  it('muestra el error de dirección al salir del campo vacío', () => {
    render(<PasoUbicacion />)
    fireEvent(screen.getByTestId('input-direccion'), 'blur')
    expect(screen.getByText('La dirección es obligatoria')).toBeTruthy()
  })

  it('muestra el error de localidad al salir del campo vacío', () => {
    render(<PasoUbicacion />)
    fireEvent(screen.getByTestId('input-localidad'), 'blur')
    expect(screen.getByText('La localidad es obligatoria')).toBeTruthy()
  })

  it('vuelve al paso anterior', () => {
    render(<PasoUbicacion />)
    fireEvent.press(screen.getByTestId('boton-atras'))
    expect(mockIrAlPasoAnterior).toHaveBeenCalledTimes(1)
  })
})
