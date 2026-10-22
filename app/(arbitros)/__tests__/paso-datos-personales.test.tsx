import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PasoDatosPersonales from '@/arbitros/_pasos/paso-datos-personales'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'

jest.mock('@/logica-compartida/hooks/use-registro-arbitro-store')
jest.mock('@/fichaje-jugador/_components/modal-fecha-nacimiento', () => {
  const { View } = require('react-native')
  return function MockModalFechaNacimiento() {
    return <View testID="modal-fecha-nacimiento-mock" />
  }
})

const mockSetDni = jest.fn()
const mockSetApellido = jest.fn()
const mockSetNombre = jest.fn()
const mockSetTelefono = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockOnVolverInicio = jest.fn()

function mockStore(overrides: Record<string, unknown> = {}) {
  return {
    paso: 1,
    dni: '',
    apellido: '',
    nombre: '',
    telefonoCelular: '',
    fechaNacimiento: null,
    setDni: mockSetDni,
    setApellido: mockSetApellido,
    setNombre: mockSetNombre,
    setTelefonoCelular: mockSetTelefono,
    irAlPasoSiguiente: mockIrAlPasoSiguiente,
    ...overrides,
  }
}

function expectContinuarDeshabilitado() {
  expect(screen.getByTestId('boton-continuar').props.accessibilityState?.disabled).toBe(true)
}

describe('PasoDatosPersonales', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore())
  })

  it('muestra el título, los campos y la fecha de nacimiento', () => {
    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)

    expect(screen.getByTestId('paso-datos-personales')).toBeTruthy()
    expect(screen.getByText('Datos personales')).toBeTruthy()
    expect(screen.getByText('Identificación y contacto')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá el DNI (7-9 dígitos)')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá los apellidos')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá el nombre')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá el teléfono celular')).toBeTruthy()
    expect(screen.getByText('Seleccioná la fecha de nacimiento')).toBeTruthy()
  })

  it('mantiene Continuar deshabilitado hasta completar los campos obligatorios', () => {
    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)
    expectContinuarDeshabilitado()
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({ dni: '12345678', apellido: 'Perez', nombre: 'Juan', telefonoCelular: '1234567' })
    )
    screen.unmount()
    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)
    expectContinuarDeshabilitado()
  })

  it('habilita Continuar y avanza cuando los datos son válidos', () => {
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({
        dni: '12345678',
        apellido: 'Perez',
        nombre: 'Juan',
        telefonoCelular: '11223344',
        fechaNacimiento: new Date(1990, 0, 1),
      })
    )

    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)

    expect(screen.getByTestId('boton-continuar').props.accessibilityState?.disabled).toBe(false)
    fireEvent.press(screen.getByTestId('boton-continuar'))
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('normaliza DNI, nombre, apellido y teléfono al escribir', () => {
    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)

    fireEvent.changeText(screen.getByTestId('input-dni'), '12a345678999')
    fireEvent.changeText(screen.getByTestId('input-apellido'), 'perez garcia')
    fireEvent.changeText(screen.getByTestId('input-nombre'), 'juan')
    fireEvent.changeText(screen.getByTestId('input-telefono'), '11-2233-4455')

    expect(mockSetDni).toHaveBeenCalledWith('123456789')
    expect(mockSetApellido).toHaveBeenCalledWith('Perez Garcia')
    expect(mockSetNombre).toHaveBeenCalledWith('Juan')
    expect(mockSetTelefono).toHaveBeenCalledWith('11223344')
  })

  it('limita nombre y apellido a 50 caracteres y el teléfono a 8 dígitos', () => {
    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)

    expect(screen.getByTestId('input-nombre').props.maxLength).toBe(50)
    expect(screen.getByTestId('input-apellido').props.maxLength).toBe(50)
    expect(screen.getByTestId('input-telefono').props.maxLength).toBe(8)
  })

  it('muestra el error de nombre y apellido vacíos al salir del campo', () => {
    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)
    fireEvent(screen.getByTestId('input-nombre'), 'blur')
    fireEvent(screen.getByTestId('input-apellido'), 'blur')

    expect(screen.getByText('El nombre es obligatorio')).toBeTruthy()
    expect(screen.getByText('El apellido es obligatorio')).toBeTruthy()
  })

  it('muestra el error del campo al salir si el dato no alcanza', () => {
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(
      mockStore({ dni: '123456', telefonoCelular: '1234567' })
    )

    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)
    fireEvent(screen.getByTestId('input-dni'), 'blur')
    fireEvent(screen.getByTestId('input-telefono'), 'blur')

    expect(screen.getByText('El DNI debe tener entre 7 y 9 dígitos')).toBeTruthy()
    expect(screen.getByText('El celular debe tener 8 dígitos')).toBeTruthy()
  })

  it('vuelve al inicio desde atrás', () => {
    render(<PasoDatosPersonales onVolverInicio={mockOnVolverInicio} />)
    fireEvent.press(screen.getByTestId('boton-atras'))
    expect(mockOnVolverInicio).toHaveBeenCalledTimes(1)
  })
})
