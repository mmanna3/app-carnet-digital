import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PantallaIntro from '../pantalla-intro'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'

jest.mock('@/lib/hooks/use-fichaje-store')

const mockIrANuevo = jest.fn()
const mockIrAYaFichado = jest.fn()

describe('PantallaIntro', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFichajeStore as unknown as jest.Mock).mockReturnValue({
      irANuevo: mockIrANuevo,
      irAYaFichado: mockIrAYaFichado,
      esDelegado: false,
    })
  })

  it('muestra las dos opciones de fichaje', () => {
    render(<PantallaIntro onVolver={() => {}} />)

    expect(screen.getByText('¿Es la primera vez que te fichás?')).toBeTruthy()
    expect(screen.getByText('¿Ya jugás en un equipo y querés ficharte en otro?')).toBeTruthy()
  })

  it('llama a irANuevo al presionar la card de nuevo jugador', () => {
    render(<PantallaIntro onVolver={() => {}} />)

    fireEvent.press(screen.getByTestId('card-nuevo'))

    expect(mockIrANuevo).toHaveBeenCalledTimes(1)
  })

  it('llama a irAYaFichado al presionar la card de ya fichado', () => {
    render(<PantallaIntro onVolver={() => {}} />)

    fireEvent.press(screen.getByTestId('card-ya-fichado'))

    expect(mockIrAYaFichado).toHaveBeenCalledTimes(1)
  })

  it('llama a onVolver al presionar el botón atrás', () => {
    const onVolver = jest.fn()
    render(<PantallaIntro onVolver={onVolver} />)

    fireEvent.press(screen.getByTestId('boton-atras'))

    expect(onVolver).toHaveBeenCalledTimes(1)
  })
})
