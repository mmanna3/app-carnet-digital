// Elimina la capa de persistencia para tests
jest.mock('zustand/middleware', () => ({
  ...jest.requireActual('zustand/middleware'),
  persist: (config: any) => config,
}))

jest.mock('../../api/api', () => ({
  api: { login: jest.fn() },
}))

import { useAuth } from '../use-auth'
import { api } from '../../api/api'
import { LoginResponseDTO } from '../../api/clients'

const mockLogin = api.login as jest.MockedFunction<typeof api.login>

const ESTADO_INICIAL = { usuario: null, token: null, isAuthenticated: false }

describe('useAuth store', () => {
  beforeEach(() => {
    useAuth.setState(ESTADO_INICIAL)
    jest.clearAllMocks()
  })

  describe('estado inicial', () => {
    it('usuario y token son null, no está autenticado', () => {
      const { usuario, token, isAuthenticated } = useAuth.getState()
      expect(usuario).toBeNull()
      expect(token).toBeNull()
      expect(isAuthenticated).toBe(false)
    })
  })

  describe('login exitoso', () => {
    it('setea token, usuario e isAuthenticated en true', async () => {
      mockLogin.mockResolvedValue(new LoginResponseDTO({ exito: true, token: 'jwt-abc-123' }))

      await useAuth.getState().login('delegado1', 'password123')

      const { token, usuario, isAuthenticated } = useAuth.getState()
      expect(token).toBe('jwt-abc-123')
      expect(usuario).toBe('delegado1')
      expect(isAuthenticated).toBe(true)
    })

    it('retorna la respuesta del servidor con exito=true', async () => {
      mockLogin.mockResolvedValue(new LoginResponseDTO({ exito: true, token: 'jwt-abc-123' }))

      const result = await useAuth.getState().login('delegado1', 'password123')

      expect(result.exito).toBe(true)
    })
  })

  describe('login fallido', () => {
    it('no modifica el estado cuando el servidor responde exito=false', async () => {
      mockLogin.mockResolvedValue(
        new LoginResponseDTO({ exito: false, error: 'Credenciales inválidas' })
      )

      await useAuth.getState().login('delegado1', 'mal-password')

      const { token, isAuthenticated } = useAuth.getState()
      expect(token).toBeNull()
      expect(isAuthenticated).toBe(false)
    })

    it('retorna el mensaje de error del servidor', async () => {
      mockLogin.mockResolvedValue(
        new LoginResponseDTO({ exito: false, error: 'Credenciales inválidas' })
      )

      const result = await useAuth.getState().login('delegado1', 'mal-password')

      expect(result.exito).toBe(false)
      expect(result.error).toBe('Credenciales inválidas')
    })

    it('usa mensaje de error por defecto cuando el servidor no envía error', async () => {
      mockLogin.mockResolvedValue(new LoginResponseDTO({ exito: false }))

      const result = await useAuth.getState().login('delegado1', 'mal-password')

      expect(result.error).toBe('Error de autenticación')
    })

    it('error de red retorna mensaje de conexión', async () => {
      mockLogin.mockRejectedValue(new Error('Network Error'))

      const result = await useAuth.getState().login('delegado1', 'password123')

      expect(result.exito).toBe(false)
      expect(result.error).toBe('Hubo un error conectándose al servidor')
    })

    it('error con response JSON retorna el mensaje del JSON', async () => {
      mockLogin.mockRejectedValue({ response: JSON.stringify({ error: 'Token expirado' }) })

      const result = await useAuth.getState().login('delegado1', 'password123')

      expect(result.error).toBe('Token expirado')
    })
  })

  describe('logout', () => {
    it('limpia token, usuario e isAuthenticated', () => {
      useAuth.setState({ token: 'jwt-token', usuario: 'delegado1', isAuthenticated: true })

      useAuth.getState().logout()

      const { token, usuario, isAuthenticated } = useAuth.getState()
      expect(token).toBeNull()
      expect(usuario).toBeNull()
      expect(isAuthenticated).toBe(false)
    })
  })

  describe('setAuthState', () => {
    it('setea token y usuario cuando ambos son válidos', () => {
      useAuth.getState().setAuthState('nuevo-token', 'nuevo-usuario')

      const { token, usuario, isAuthenticated } = useAuth.getState()
      expect(token).toBe('nuevo-token')
      expect(usuario).toBe('nuevo-usuario')
      expect(isAuthenticated).toBe(true)
    })

    it('limpia el estado cuando el token es una cadena vacía', () => {
      useAuth.setState({ token: 'viejo-token', usuario: 'viejo-usuario', isAuthenticated: true })

      useAuth.getState().setAuthState('', 'usuario')

      const { token, isAuthenticated } = useAuth.getState()
      expect(token).toBeNull()
      expect(isAuthenticated).toBe(false)
    })

    it('limpia el estado cuando el usuario es una cadena vacía', () => {
      useAuth.setState({ token: 'viejo-token', usuario: 'viejo-usuario', isAuthenticated: true })

      useAuth.getState().setAuthState('token', '')

      const { token, isAuthenticated } = useAuth.getState()
      expect(token).toBeNull()
      expect(isAuthenticated).toBe(false)
    })
  })
})
