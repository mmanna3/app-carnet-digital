import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PantallaIntroDelegado from '../pantalla-intro-delegado'

describe('PantallaIntroDelegado', () => {
  const mockOnNuevo = jest.fn()
  const mockOnYaFichado = jest.fn()
  const mockOnVolver = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('muestra las dos opciones de fichaje para delegado', () => {
    render(
      <PantallaIntroDelegado
        onNuevo={mockOnNuevo}
        onYaFichado={mockOnYaFichado}
        onVolver={mockOnVolver}
      />
    )

    expect(screen.getByText('Fichar nuevo jugador')).toBeTruthy()
    expect(screen.getByText('Jugador ya fichado en la liga')).toBeTruthy()
  })

  it('llama a onNuevo al presionar la card de nuevo jugador', () => {
    render(
      <PantallaIntroDelegado
        onNuevo={mockOnNuevo}
        onYaFichado={mockOnYaFichado}
        onVolver={mockOnVolver}
      />
    )

    fireEvent.press(screen.getByTestId('card-nuevo'))

    expect(mockOnNuevo).toHaveBeenCalledTimes(1)
  })

  it('llama a onYaFichado al presionar la card de ya fichado', () => {
    render(
      <PantallaIntroDelegado
        onNuevo={mockOnNuevo}
        onYaFichado={mockOnYaFichado}
        onVolver={mockOnVolver}
      />
    )

    fireEvent.press(screen.getByTestId('card-ya-fichado'))

    expect(mockOnYaFichado).toHaveBeenCalledTimes(1)
  })
})
