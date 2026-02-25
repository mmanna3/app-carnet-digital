/**
 * Tests de integración del flujo de autorización.
 * Prueba login, estado autenticado y logout usando useAuth real.
 */
jest.mock('zustand/middleware', () => ({
  ...jest.requireActual('zustand/middleware'),
  persist: (config: any) => config,
}))

import { useAuth } from '../use-auth'
import { LoginResponseDTO } from '../../api/clients'

const mockLoginImpl = jest.fn<(u: string, p: string) => Promise<LoginResponseDTO>>()

describe('flujo de autorización', () => {
  beforeEach(() => {
    useAuth.setState({ usuario: null, token: null, isAuthenticated: false })
    useAuth.getState()._setLoginImpl(mockLoginImpl)
    jest.clearAllMocks()
  })

  describe('login → estado autenticado → logout', () => {
    it('usuario no autenticado puede hacer login y quedar autenticado', async () => {
      expect(useAuth.getState().isAuthenticated).toBe(false)

      mockLoginImpl.mockResolvedValue(
        new LoginResponseDTO({ exito: true, token: 'jwt-delegado-123' })
      )

      const result = await useAuth.getState().login('delegado1', 'password123')

      expect(result.exito).toBe(true)
      expect(useAuth.getState().isAuthenticated).toBe(true)
      expect(useAuth.getState().token).toBe('jwt-delegado-123')
      expect(useAuth.getState().usuario).toBe('delegado1')
    })

    it('usuario autenticado puede hacer logout y quedar desautenticado', async () => {
      mockLoginImpl.mockResolvedValue(
        new LoginResponseDTO({ exito: true, token: 'jwt-token' })
      )
      await useAuth.getState().login('delegado1', 'password123')

      expect(useAuth.getState().isAuthenticated).toBe(true)

      useAuth.getState().logout()

      expect(useAuth.getState().isAuthenticated).toBe(false)
      expect(useAuth.getState().token).toBeNull()
      expect(useAuth.getState().usuario).toBeNull()
    })

    it('flujo completo: login exitoso → logout limpia todo el estado', async () => {
      mockLoginImpl.mockResolvedValue(
        new LoginResponseDTO({ exito: true, token: 'jwt-abc' })
      )

      await useAuth.getState().login('delegado1', 'secret')
      const estadoAutenticado = useAuth.getState()

      expect(estadoAutenticado.token).toBe('jwt-abc')
      expect(estadoAutenticado.usuario).toBe('delegado1')
      expect(estadoAutenticado.isAuthenticated).toBe(true)

      useAuth.getState().logout()
      const estadoDeslogueado = useAuth.getState()

      expect(estadoDeslogueado.token).toBeNull()
      expect(estadoDeslogueado.usuario).toBeNull()
      expect(estadoDeslogueado.isAuthenticated).toBe(false)
    })
  })

  describe('setAuthState (usado tras cambiar contraseña)', () => {
    it('setAuthState permite autenticar sin llamar a la API', () => {
      expect(useAuth.getState().isAuthenticated).toBe(false)

      useAuth.getState().setAuthState('token-nuevo', 'delegado1')

      expect(useAuth.getState().isAuthenticated).toBe(true)
      expect(useAuth.getState().token).toBe('token-nuevo')
      expect(useAuth.getState().usuario).toBe('delegado1')
      expect(mockLoginImpl).not.toHaveBeenCalled()
    })

    it('flujo cambiar-password: setAuthState tras cambio exitoso', async () => {
      // Simula que el usuario llegó desde login con "debe cambiar contraseña"
      // y completó el cambio en cambiar-password. La API devuelve token nuevo.
      const tokenTrasCambio = 'jwt-tras-cambiar-password'

      useAuth.getState().setAuthState(tokenTrasCambio, 'delegado1')

      expect(useAuth.getState().isAuthenticated).toBe(true)
      expect(useAuth.getState().token).toBe(tokenTrasCambio)
      expect(useAuth.getState().usuario).toBe('delegado1')
    })
  })

  describe('login fallido no modifica estado', () => {
    it('credenciales inválidas dejan al usuario desautenticado', async () => {
      mockLoginImpl.mockResolvedValue(
        new LoginResponseDTO({ exito: false, error: 'Credenciales inválidas' })
      )

      const result = await useAuth.getState().login('delegado1', 'mal-password')

      expect(result.exito).toBe(false)
      expect(useAuth.getState().isAuthenticated).toBe(false)
      expect(useAuth.getState().token).toBeNull()
    })

    it('error de red deja al usuario desautenticado', async () => {
      mockLoginImpl.mockRejectedValue(new Error('Network Error'))

      const result = await useAuth.getState().login('delegado1', 'password')

      expect(result.exito).toBe(false)
      expect(result.error).toBe('Hubo un error conectándose al servidor')
      expect(useAuth.getState().isAuthenticated).toBe(false)
    })
  })
})
