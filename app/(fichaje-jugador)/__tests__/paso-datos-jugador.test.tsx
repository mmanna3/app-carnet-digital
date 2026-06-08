import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import PasoDatosJugador from '@/fichaje-jugador/_pasos/fichaje-nuevo/paso-datos-jugador'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'

jest.mock('@/lib/hooks/use-fichaje-store')
jest.mock('@/fichaje-jugador/_components/modal-fecha-nacimiento', () => {
  const { View } = require('react-native')
  return function MockModalFechaNacimiento() {
    return <View testID="modal-fecha-nacimiento-mock" />
  }
})

const mockSetNombre = jest.fn()
const mockSetApellido = jest.fn()
const mockSetDni = jest.fn()
const mockSetFechaNac = jest.fn()
const mockIrAlPasoAnterior = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockValidarDniNuevo = jest.fn()

const FECHA_NAC = new Date(2010, 2, 15)

function mockStore(overrides: Record<string, unknown> = {}) {
  return {
    nombre: '',
    apellido: '',
    dni: '',
    fechaNac: null,
    nombreEquipo: 'Equipo Norte',
    paso: 2,
    esDelegado: false,
    calcularTotalPasos: () => 5,
    setNombre: mockSetNombre,
    setApellido: mockSetApellido,
    setDni: mockSetDni,
    setFechaNac: mockSetFechaNac,
    irAlPasoAnterior: mockIrAlPasoAnterior,
    irAlPasoSiguiente: mockIrAlPasoSiguiente,
    validarDniNuevo: mockValidarDniNuevo,
    ...overrides,
  }
}

function expectContinuarDeshabilitado() {
  const boton = screen.getByTestId('boton-continuar')
  expect(boton.props.accessibilityState?.disabled).toBe(true)
}

function expectContinuarHabilitado() {
  const boton = screen.getByTestId('boton-continuar')
  expect(boton.props.accessibilityState?.disabled).toBe(false)
}

describe('PasoDatosJugador', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(mockStore())
  })

  it('muestra el título y los campos del formulario', () => {
    render(<PasoDatosJugador />)

    expect(screen.getByText('Datos del jugador')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá el nombre del jugador')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá el apellido del jugador')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá el DNI del jugador (7-9 dígitos)')).toBeTruthy()
    expect(screen.getByText('Equipo Norte')).toBeTruthy()
  })

  describe('campos obligatorios', () => {
    it('el botón Continuar está deshabilitado con todos los campos vacíos', () => {
      render(<PasoDatosJugador />)
      expectContinuarDeshabilitado()
    })

    it('sigue deshabilitado solo con nombre', () => {
      ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(mockStore({ nombre: 'Juan' }))

      render(<PasoDatosJugador />)
      expectContinuarDeshabilitado()
    })

    it('sigue deshabilitado con nombre y apellido', () => {
      ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
        mockStore({ nombre: 'Juan', apellido: 'Perez' })
      )

      render(<PasoDatosJugador />)
      expectContinuarDeshabilitado()
    })

    it('sigue deshabilitado con nombre, apellido y DNI válido pero sin fecha', () => {
      ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
        mockStore({ nombre: 'Juan', apellido: 'Perez', dni: '12345678' })
      )

      render(<PasoDatosJugador />)
      expectContinuarDeshabilitado()
    })

    it('se habilita cuando los cuatro campos están completos', () => {
      ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
        mockStore({
          nombre: 'Juan',
          apellido: 'Perez',
          dni: '12345678',
          fechaNac: FECHA_NAC,
        })
      )

      render(<PasoDatosJugador />)
      expectContinuarHabilitado()
    })
  })

  describe('validación de DNI', () => {
    it('el botón Continuar está deshabilitado con DNI de menos de 7 dígitos', () => {
      ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
        mockStore({
          nombre: 'Juan',
          apellido: 'Perez',
          dni: '12345',
          fechaNac: FECHA_NAC,
        })
      )

      render(<PasoDatosJugador />)
      expectContinuarDeshabilitado()
    })

    it('se habilita con DNI de 7 dígitos y el resto de campos completos', () => {
      ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
        mockStore({
          nombre: 'Juan',
          apellido: 'Perez',
          dni: '1234567',
          fechaNac: FECHA_NAC,
        })
      )

      render(<PasoDatosJugador />)
      expectContinuarHabilitado()
    })

    it('se habilita con DNI de 9 dígitos y el resto de campos completos', () => {
      ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
        mockStore({
          nombre: 'Juan',
          apellido: 'Perez',
          dni: '123456789',
          fechaNac: FECHA_NAC,
        })
      )

      render(<PasoDatosJugador />)
      expectContinuarHabilitado()
    })
  })

  it('llama a validarDniNuevo y avanza cuando la validación es exitosa', async () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
      mockStore({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        fechaNac: FECHA_NAC,
      })
    )
    mockValidarDniNuevo.mockResolvedValue({ ok: true })

    render(<PasoDatosJugador />)
    fireEvent.press(screen.getByTestId('boton-continuar'))

    await waitFor(() => expect(mockValidarDniNuevo).toHaveBeenCalled())
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('muestra error cuando la validación del DNI falla', async () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue(
      mockStore({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        fechaNac: FECHA_NAC,
      })
    )
    mockValidarDniNuevo.mockResolvedValue({
      ok: false,
      error: 'El DNI ya está fichado en este equipo.',
    })

    render(<PasoDatosJugador />)
    fireEvent.press(screen.getByTestId('boton-continuar'))

    expect(await screen.findByText('El DNI ya está fichado en este equipo.')).toBeTruthy()
    expect(mockIrAlPasoSiguiente).not.toHaveBeenCalled()
  })

  it('llama a irAlPasoAnterior al presionar atrás', () => {
    render(<PasoDatosJugador />)

    fireEvent.press(screen.getByTestId('boton-atras'))

    expect(mockIrAlPasoAnterior).toHaveBeenCalledTimes(1)
  })
})
