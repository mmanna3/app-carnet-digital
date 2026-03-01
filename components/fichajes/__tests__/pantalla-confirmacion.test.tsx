import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PantallaConfirmacion from '../pantalla-confirmacion'

describe('PantallaConfirmacion', () => {
  const mockOnVolverInicio = jest.fn()
  const MENSAJE = 'El fichaje fue completado exitosamente.'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('muestra el mensaje de confirmación', () => {
    render(<PantallaConfirmacion mensaje={MENSAJE} onVolverInicio={mockOnVolverInicio} />)

    expect(screen.getByText('¡Fichaje completado!')).toBeTruthy()
    expect(screen.getByText(MENSAJE)).toBeTruthy()
  })

  it('llama a onVolverInicio al presionar Volver al inicio', () => {
    render(<PantallaConfirmacion mensaje={MENSAJE} onVolverInicio={mockOnVolverInicio} />)

    fireEvent.press(screen.getByTestId('boton-volver-inicio'))

    expect(mockOnVolverInicio).toHaveBeenCalledTimes(1)
  })

  it('muestra el botón Fichar otro jugador cuando onFicharOtro está definido', () => {
    const mockOnFicharOtro = jest.fn()
    render(
      <PantallaConfirmacion
        mensaje={MENSAJE}
        onVolverInicio={mockOnVolverInicio}
        onFicharOtro={mockOnFicharOtro}
      />
    )

    expect(screen.getByText('Fichar otro jugador')).toBeTruthy()

    fireEvent.press(screen.getByTestId('boton-fichar-otro'))

    expect(mockOnFicharOtro).toHaveBeenCalledTimes(1)
  })

  it('no muestra el botón Fichar otro cuando onFicharOtro no está definido', () => {
    render(<PantallaConfirmacion mensaje={MENSAJE} onVolverInicio={mockOnVolverInicio} />)

    expect(screen.queryByTestId('boton-fichar-otro')).toBeNull()
  })
})
