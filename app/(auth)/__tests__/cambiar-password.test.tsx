import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import CambiarPasswordScreen from '../cambiar-password'
import { useAuth } from '@/lib/hooks/use-auth'
import { useLocalSearchParams } from 'expo-router'
import { api } from '@/lib/api/api'

jest.mock('@/lib/hooks/use-auth')
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}))
jest.mock('@/lib/api/api', () => ({
  api: { cambiarPassword: jest.fn() },
}))

const mockSetAuthState = jest.fn()

describe('CambiarPasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({ setAuthState: mockSetAuthState })
    ;(useLocalSearchParams as jest.Mock).mockReturnValue({ usuario: 'delegado1' })
  })

  describe('renderizado', () => {
    it('muestra el título y la instrucción', () => {
      render(<CambiarPasswordScreen />)
      expect(screen.getAllByText('Cambiar Contraseña').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Por favor ingrese su nueva contraseña')).toBeTruthy()
    })

    it('muestra el usuario desde los params', () => {
      render(<CambiarPasswordScreen />)
      expect(screen.getByDisplayValue('delegado1')).toBeTruthy()
    })

    it('muestra los campos de nueva contraseña y confirmar', () => {
      render(<CambiarPasswordScreen />)
      expect(screen.getByPlaceholderText('Nueva Contraseña')).toBeTruthy()
      expect(screen.getByPlaceholderText('Confirmar Nueva Contraseña')).toBeTruthy()
    })
  })

  describe('validación', () => {
    it('muestra error cuando los campos están vacíos', async () => {
      render(<CambiarPasswordScreen />)

      fireEvent.press(screen.getByTestId('boton-cambiar-password'))

      expect(screen.getByText('Por favor complete todos los campos')).toBeTruthy()
      expect(api.cambiarPassword).not.toHaveBeenCalled()
    })

    it('muestra error cuando las contraseñas no coinciden', async () => {
      render(<CambiarPasswordScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Nueva Contraseña'), 'nuevaPass123')
      fireEvent.changeText(screen.getByPlaceholderText('Confirmar Nueva Contraseña'), 'otraPass456')
      fireEvent.press(screen.getByTestId('boton-cambiar-password'))

      expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy()
      expect(api.cambiarPassword).not.toHaveBeenCalled()
    })
  })

  describe('flujo exitoso', () => {
    it('llama a api.cambiarPassword y setAuthState cuando el cambio es exitoso', async () => {
      ;(api.cambiarPassword as jest.Mock).mockResolvedValue({
        exito: true,
        token: 'nuevo-jwt-token',
      })

      render(<CambiarPasswordScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Nueva Contraseña'), 'nuevaPass123')
      fireEvent.changeText(
        screen.getByPlaceholderText('Confirmar Nueva Contraseña'),
        'nuevaPass123'
      )
      fireEvent.press(screen.getByTestId('boton-cambiar-password'))

      await waitFor(() => expect(api.cambiarPassword).toHaveBeenCalled())
      await waitFor(() =>
        expect(mockSetAuthState).toHaveBeenCalledWith('nuevo-jwt-token', 'delegado1')
      )

      expect(api.cambiarPassword).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario: 'delegado1',
          passwordNuevo: 'nuevaPass123',
        })
      )
    })
  })

  describe('flujo con error', () => {
    it('muestra el mensaje de error cuando el servidor falla', async () => {
      ;(api.cambiarPassword as jest.Mock).mockResolvedValue({
        exito: false,
        error: 'La contraseña no cumple los requisitos',
      })

      render(<CambiarPasswordScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Nueva Contraseña'), 'abc')
      fireEvent.changeText(screen.getByPlaceholderText('Confirmar Nueva Contraseña'), 'abc')
      fireEvent.press(screen.getByTestId('boton-cambiar-password'))

      expect(await screen.findByText('La contraseña no cumple los requisitos')).toBeTruthy()
      expect(mockSetAuthState).not.toHaveBeenCalled()
    })
  })
})
