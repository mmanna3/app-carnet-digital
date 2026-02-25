import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import LoginScreen from '../login'
import { useAuth } from '@/lib/hooks/use-auth'
import { useRouter } from 'expo-router'
import { LoginResponseDTO } from '@/lib/api/clients'

jest.mock('@/lib/hooks/use-auth')
jest.mock('expo-router')

const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
const mockRouterBack = jest.fn()

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({ login: mockLogin })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
    })
  })

  describe('renderizado', () => {
    it('muestra el título de inicio de sesión', () => {
      render(<LoginScreen />)
      expect(screen.getByText('Inicio de sesión')).toBeTruthy()
    })

    it('muestra los campos de usuario y contraseña', () => {
      render(<LoginScreen />)
      expect(screen.getByPlaceholderText('Usuario')).toBeTruthy()
      expect(screen.getByPlaceholderText('Contraseña')).toBeTruthy()
    })

    it('muestra el botón Iniciar Sesión', () => {
      render(<LoginScreen />)
      expect(screen.getByText('Iniciar Sesión')).toBeTruthy()
    })

    it('muestra el botón Volver', () => {
      render(<LoginScreen />)
      expect(screen.getByText('← Volver')).toBeTruthy()
    })
  })

  describe('validación', () => {
    it('muestra error cuando se envía sin usuario ni contraseña', async () => {
      render(<LoginScreen />)

      fireEvent.press(screen.getByText('Iniciar Sesión'))

      expect(screen.getByText('Por favor ingrese usuario y contraseña')).toBeTruthy()
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('muestra error cuando solo falta contraseña', async () => {
      render(<LoginScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'delegado1')
      fireEvent.press(screen.getByText('Iniciar Sesión'))

      expect(screen.getByText('Por favor ingrese usuario y contraseña')).toBeTruthy()
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  describe('flujo de login exitoso', () => {
    it('llama a login con usuario y contraseña ingresados', async () => {
      mockLogin.mockImplementation(
        () => new Promise((r) => setTimeout(() => r(new LoginResponseDTO({ exito: true, token: 'jwt-123' })), 10))
      )

      render(<LoginScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'delegado1')
      fireEvent.changeText(screen.getByPlaceholderText('Contraseña'), 'miPassword123')
      fireEvent.press(screen.getByText('Iniciar Sesión'))

      await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('delegado1', 'miPassword123'))
    })

    it('no muestra error cuando el login es exitoso', async () => {
      mockLogin.mockResolvedValue(new LoginResponseDTO({ exito: true, token: 'jwt-123' }))

      render(<LoginScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'delegado1')
      fireEvent.changeText(screen.getByPlaceholderText('Contraseña'), 'password')
      fireEvent.press(screen.getByText('Iniciar Sesión'))

      await waitFor(() => expect(mockLogin).toHaveBeenCalled())
      await waitFor(() => expect(screen.getByText('Iniciar Sesión')).toBeTruthy())

      expect(screen.queryByText(/error/i)).toBeNull()
    })
  })

  describe('flujo de login fallido', () => {
    it('muestra el mensaje de error del servidor', async () => {
      mockLogin.mockResolvedValue(
        new LoginResponseDTO({ exito: false, error: 'Credenciales inválidas' })
      )

      render(<LoginScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'delegado1')
      fireEvent.changeText(screen.getByPlaceholderText('Contraseña'), 'mal-password')
      fireEvent.press(screen.getByText('Iniciar Sesión'))

      expect(await screen.findByText('Credenciales inválidas')).toBeTruthy()
    })

    it('navega a cambiar-password cuando el servidor indica cambio obligatorio', async () => {
      mockLogin.mockResolvedValue(
        new LoginResponseDTO({
          exito: false,
          error: 'El usuario debe cambiar la contraseña',
        })
      )

      render(<LoginScreen />)

      fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'delegado1')
      fireEvent.changeText(screen.getByPlaceholderText('Contraseña'), 'temp123')
      fireEvent.press(screen.getByText('Iniciar Sesión'))

      await screen.findByText('El usuario debe cambiar la contraseña')

      expect(mockRouterPush).toHaveBeenCalledWith({
        pathname: '/cambiar-password',
        params: { usuario: 'delegado1' },
      })
    })
  })

  describe('navegación', () => {
    it('llama a router.back al presionar Volver', () => {
      render(<LoginScreen />)

      fireEvent.press(screen.getByText('← Volver'))

      expect(mockRouterBack).toHaveBeenCalled()
    })
  })
})
