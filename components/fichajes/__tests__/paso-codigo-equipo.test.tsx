import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import PasoCodigoEquipo from '../paso-codigo-equipo'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'

jest.mock('@/lib/hooks/use-fichaje-store')

const mockSetCodigoEquipo = jest.fn()
const mockIrAIntro = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockValidarCodigoEquipo = jest.fn()

describe('PasoCodigoEquipo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      flujo: 'nuevo',
      codigoEquipo: '',
      nombreEquipo: null,
      setCodigoEquipo: mockSetCodigoEquipo,
      irAIntro: mockIrAIntro,
      irAlPasoSiguiente: mockIrAlPasoSiguiente,
      validarCodigoEquipo: mockValidarCodigoEquipo,
      esDelegado: false,
      calcularTotalPasos: () => 5,
    })
  })

  it('muestra el título de ingresar código', () => {
    render(<PasoCodigoEquipo />)

    expect(screen.getByText('Ingresá el código de tu equipo')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ingresá el código')).toBeTruthy()
  })

  it('el botón Validar está deshabilitado cuando el código está vacío', () => {
    render(<PasoCodigoEquipo />)

    const boton = screen.getByTestId('boton-validar')
    expect(boton.props.accessibilityState?.disabled).toBe(true)
  })

  it('llama a validarCodigoEquipo y avanza cuando el código es válido', async () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      flujo: 'nuevo',
      codigoEquipo: 'ABC1234',
      nombreEquipo: null,
      setCodigoEquipo: mockSetCodigoEquipo,
      irAIntro: mockIrAIntro,
      irAlPasoSiguiente: mockIrAlPasoSiguiente,
      validarCodigoEquipo: mockValidarCodigoEquipo,
      esDelegado: false,
      calcularTotalPasos: () => 5,
    })
    mockValidarCodigoEquipo.mockResolvedValue({ ok: true })

    render(<PasoCodigoEquipo />)

    fireEvent.press(screen.getByTestId('boton-validar'))

    await waitFor(() => expect(mockValidarCodigoEquipo).toHaveBeenCalled())
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('muestra error cuando el código es inválido', async () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      flujo: 'nuevo',
      codigoEquipo: 'XXX000',
      nombreEquipo: null,
      setCodigoEquipo: mockSetCodigoEquipo,
      irAIntro: mockIrAIntro,
      irAlPasoSiguiente: mockIrAlPasoSiguiente,
      validarCodigoEquipo: mockValidarCodigoEquipo,
      esDelegado: false,
      calcularTotalPasos: () => 5,
    })
    mockValidarCodigoEquipo.mockResolvedValue({ ok: false, error: 'Código incorrecto' })

    render(<PasoCodigoEquipo />)

    fireEvent.press(screen.getByTestId('boton-validar'))

    expect(await screen.findByText('Código incorrecto')).toBeTruthy()
    expect(mockIrAlPasoSiguiente).not.toHaveBeenCalled()
  })

  it('llama a irAIntro al presionar atrás', () => {
    render(<PasoCodigoEquipo />)

    fireEvent.press(screen.getByTestId('boton-atras'))

    expect(mockIrAIntro).toHaveBeenCalledTimes(1)
  })
})
