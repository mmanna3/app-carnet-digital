// Las variables mock* se definen DENTRO del factory para sobrevivir al hoisting de jest.mock
jest.mock('../../hooks/use-auth', () => ({
  useAuth: { getState: jest.fn() },
}))

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}))

import { HttpClientWrapper } from '../http-client-wrapper'
import { useAuth } from '../../hooks/use-auth'
import { router } from 'expo-router'

const mockGetState = useAuth.getState as jest.Mock
const mockRouterReplace = router.replace as jest.Mock
const mockLogout = jest.fn()

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('HttpClientWrapper', () => {
  let wrapper: HttpClientWrapper

  beforeEach(() => {
    wrapper = new HttpClientWrapper()
    jest.clearAllMocks()
    mockGetState.mockReturnValue({ token: null, logout: mockLogout })
    mockFetch.mockResolvedValue({ status: 200 } as Response)
  })

  describe('rutas públicas', () => {
    it('/api/Auth/login no recibe header de Authorization', async () => {
      mockGetState.mockReturnValue({ token: 'jwt-token', logout: mockLogout })

      await wrapper.fetch('https://api.example.com/api/Auth/login')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string>)?.Authorization).toBeUndefined()
    })

    it('/api/Publico no recibe header de Authorization', async () => {
      mockGetState.mockReturnValue({ token: 'jwt-token', logout: mockLogout })

      await wrapper.fetch('https://api.example.com/api/Publico/carnets')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string>)?.Authorization).toBeUndefined()
    })
  })

  describe('inyección del token', () => {
    it('agrega Authorization: Bearer en rutas privadas con token', async () => {
      mockGetState.mockReturnValue({ token: 'mi-jwt-token', logout: mockLogout })

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer mi-jwt-token')
    })

    it('no agrega Authorization si no hay token', async () => {
      mockGetState.mockReturnValue({ token: null, logout: mockLogout })

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string> | undefined)?.Authorization).toBeUndefined()
    })

    it('preserva headers existentes al agregar Authorization', async () => {
      mockGetState.mockReturnValue({ token: 'mi-jwt-token', logout: mockLogout })

      await wrapper.fetch('https://api.example.com/api/privado', {
        headers: { 'Content-Type': 'application/json' },
      })

      const [, init] = mockFetch.mock.calls[0]
      const headers = init?.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer mi-jwt-token')
      expect(headers['Content-Type']).toBe('application/json')
    })

    it('maneja correctamente un objeto Headers nativo', async () => {
      mockGetState.mockReturnValue({ token: 'mi-jwt-token', logout: mockLogout })
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')

      await wrapper.fetch('https://api.example.com/api/privado', { headers })

      const [, init] = mockFetch.mock.calls[0]
      const resultHeaders = init?.headers as Record<string, string>
      expect(resultHeaders.Authorization).toBe('Bearer mi-jwt-token')
      expect(resultHeaders['content-type']).toBe('application/json')
    })

    it('funciona sin init previo', async () => {
      mockGetState.mockReturnValue({ token: 'mi-jwt-token', logout: mockLogout })

      await wrapper.fetch('https://api.example.com/api/privado')

      const [, init] = mockFetch.mock.calls[0]
      const headers = init?.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer mi-jwt-token')
    })
  })

  describe('manejo de 401', () => {
    it('respuesta 401 en ruta privada ejecuta logout y redirige al login', async () => {
      mockGetState.mockReturnValue({ token: 'expired-token', logout: mockLogout })
      mockFetch.mockResolvedValue({ status: 401 } as Response)

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith('/(auth)/login')
    })

    it('respuesta 401 en ruta pública NO ejecuta logout', async () => {
      mockGetState.mockReturnValue({ token: null, logout: mockLogout })
      mockFetch.mockResolvedValue({ status: 401 } as Response)

      await wrapper.fetch('https://api.example.com/api/Auth/login')

      expect(mockLogout).not.toHaveBeenCalled()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })

    it('respuesta 200 no ejecuta logout', async () => {
      mockGetState.mockReturnValue({ token: 'valid-token', logout: mockLogout })
      mockFetch.mockResolvedValue({ status: 200 } as Response)

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      expect(mockLogout).not.toHaveBeenCalled()
    })
  })

  describe('valor de retorno', () => {
    it('retorna la respuesta original del fetch', async () => {
      mockGetState.mockReturnValue({ token: null, logout: mockLogout })
      const mockResponse = { status: 200, json: jest.fn() } as unknown as Response
      mockFetch.mockResolvedValue(mockResponse)

      const result = await wrapper.fetch('https://api.example.com/api/Auth/login')

      expect(result).toBe(mockResponse)
    })
  })
})
