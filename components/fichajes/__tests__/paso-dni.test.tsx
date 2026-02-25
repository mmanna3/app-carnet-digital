import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import PasoDni from '../ya-fichado/paso-dni'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'

jest.mock('@/lib/hooks/use-fichaje-store')

const mockSetDni = jest.fn()
const mockIrAlPasoAnterior = jest.fn()
const mockIrAlPasoSiguiente = jest.fn()
const mockEnviarFichajeYaFichado = jest.fn()

describe('PasoDni', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      dni: '',
      nombreEquipo: 'Equipo Norte',
      setDni: mockSetDni,
      irAlPasoAnterior: mockIrAlPasoAnterior,
      irAlPasoSiguiente: mockIrAlPasoSiguiente,
      enviarFichajeYaFichado: mockEnviarFichajeYaFichado,
      esDelegado: false,
      calcularTotalPasos: () => 3,
    })
  })

  it('muestra el título y el nombre del equipo', () => {
    render(<PasoDni />)

    expect(screen.getByText('Datos generales')).toBeTruthy()
    expect(screen.getByText(/Fichándose en/)).toBeTruthy()
    expect(screen.getByText('Equipo Norte')).toBeTruthy()
  })

  it('muestra el campo DNI', () => {
    render(<PasoDni />)

    expect(screen.getByPlaceholderText('Ingresá tu DNI (7-9 dígitos)')).toBeTruthy()
  })

  it('el botón Continuar está deshabilitado cuando el DNI está vacío', () => {
    render(<PasoDni />)

    const boton = screen.getByTestId('boton-continuar')
    expect(boton.props.accessibilityState?.disabled).toBe(true)
  })

  it('llama a enviarFichajeYaFichado y avanza cuando es exitoso', async () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      dni: '12345678',
      nombreEquipo: 'Equipo Norte',
      setDni: mockSetDni,
      irAlPasoAnterior: mockIrAlPasoAnterior,
      irAlPasoSiguiente: mockIrAlPasoSiguiente,
      enviarFichajeYaFichado: mockEnviarFichajeYaFichado,
      esDelegado: false,
      calcularTotalPasos: () => 3,
    })
    mockEnviarFichajeYaFichado.mockResolvedValue({ ok: true })

    render(<PasoDni />)

    fireEvent.press(screen.getByTestId('boton-continuar'))

    await waitFor(() => expect(mockEnviarFichajeYaFichado).toHaveBeenCalled())
    expect(mockIrAlPasoSiguiente).toHaveBeenCalledTimes(1)
  })

  it('muestra error cuando el fichaje falla', async () => {
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      dni: '12345678',
      nombreEquipo: 'Equipo Norte',
      setDni: mockSetDni,
      irAlPasoAnterior: mockIrAlPasoAnterior,
      irAlPasoSiguiente: mockIrAlPasoSiguiente,
      enviarFichajeYaFichado: mockEnviarFichajeYaFichado,
      esDelegado: false,
      calcularTotalPasos: () => 3,
    })
    mockEnviarFichajeYaFichado.mockResolvedValue({
      ok: false,
      error: 'No estás fichado en ningún equipo activo.',
    })

    render(<PasoDni />)

    fireEvent.press(screen.getByTestId('boton-continuar'))

    expect(await screen.findByText('No estás fichado en ningún equipo activo.')).toBeTruthy()
    expect(mockIrAlPasoSiguiente).not.toHaveBeenCalled()
  })

  it('llama a irAlPasoAnterior y limpia DNI al presionar atrás', () => {
    render(<PasoDni />)

    fireEvent.press(screen.getByTestId('boton-atras'))

    expect(mockSetDni).toHaveBeenCalledWith('')
    expect(mockIrAlPasoAnterior).toHaveBeenCalledTimes(1)
  })
})
