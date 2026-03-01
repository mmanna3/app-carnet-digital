import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import FichajesScreen from '../fichajes'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import { useRouter } from 'expo-router'

jest.mock('@/lib/hooks/use-fichaje-store')
jest.mock('expo-router')

const mockResetear = jest.fn()
const mockRouterReplace = jest.fn()

describe('FichajesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      flujo: 'intro',
      paso: 1,
      resetear: mockResetear,
      irANuevo: jest.fn(),
      irAYaFichado: jest.fn(),
      esDelegado: false,
    })
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace })
  })

  it('muestra PantallaIntro cuando flujo es intro', () => {
    render(<FichajesScreen />)

    expect(screen.getByText('¿Es la primera vez que te fichás?')).toBeTruthy()
  })

  it('muestra PasoCodigoEquipo cuando flujo es nuevo y paso es 1', () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      flujo: 'nuevo',
      paso: 1,
      resetear: mockResetear,
      codigoEquipo: '',
      nombreEquipo: null,
      setCodigoEquipo: jest.fn(),
      irAIntro: jest.fn(),
      irAlPasoSiguiente: jest.fn(),
      validarCodigoEquipo: jest.fn(),
      esDelegado: false,
      calcularTotalPasos: () => 5,
    })

    render(<FichajesScreen />)

    expect(screen.getByText('Ingresá el código de tu equipo')).toBeTruthy()
  })

  it('resetear y router.replace al volver al inicio desde intro', () => {
    render(<FichajesScreen />)

    fireEvent.press(screen.getByTestId('boton-atras'))

    expect(mockResetear).toHaveBeenCalledTimes(1)
    expect(mockRouterReplace).toHaveBeenCalledWith('/home')
  })

  it('muestra PantallaConfirmacion cuando flujo nuevo llega a paso 6', () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      flujo: 'nuevo',
      paso: 6,
      resetear: mockResetear,
      esDelegado: false,
      calcularTotalPasos: () => 5,
    })

    render(<FichajesScreen />)

    expect(screen.getByText('¡Fichaje completado!')).toBeTruthy()
    expect(
      screen.getByText('Vas a recibir la confirmación de tu fichaje por parte de tu delegado.')
    ).toBeTruthy()
  })

  it('muestra PantallaConfirmacion cuando flujo yaFichado llega a paso 3', () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      flujo: 'yaFichado',
      paso: 3,
      resetear: mockResetear,
      esDelegado: false,
      calcularTotalPasos: () => 3,
    })

    render(<FichajesScreen />)

    expect(screen.getByText('¡Fichaje completado!')).toBeTruthy()
  })
})
