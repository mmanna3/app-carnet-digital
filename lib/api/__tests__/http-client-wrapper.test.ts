jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}))

import { HttpClientWrapper } from '../http-client-wrapper'
import { router } from 'expo-router'

const mockRouterReplace = router.replace as jest.Mock
const mockLogout = jest.fn()
const mockGetToken = jest.fn()

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('HttpClientWrapper', () => {
  let wrapper: HttpClientWrapper

  beforeEach(() => {
    wrapper = new HttpClientWrapper(mockGetToken, mockLogout)
    jest.clearAllMocks()
    mockGetToken.mockReturnValue(null)
    mockFetch.mockResolvedValue({ status: 200 } as Response)
  })

  describe('rutas públicas', () => {
    it('/api/Auth/login no recibe header de Authorization', async () => {
      mockGetToken.mockReturnValue('jwt-token')

      await wrapper.fetch('https://api.example.com/api/Auth/login')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string>)?.Authorization).toBeUndefined()
    })

    it('/api/Publico no recibe header de Authorization', async () => {
      mockGetToken.mockReturnValue('jwt-token')

      await wrapper.fetch('https://api.example.com/api/Publico/carnets')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string>)?.Authorization).toBeUndefined()
    })
  })

  describe('inyección del token', () => {
    it('agrega Authorization: Bearer en rutas privadas con token', async () => {
      mockGetToken.mockReturnValue('mi-jwt-token')

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer mi-jwt-token')
    })

    it('no agrega Authorization si no hay token', async () => {
      mockGetToken.mockReturnValue(null)

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      const [, init] = mockFetch.mock.calls[0]
      expect((init?.headers as Record<string, string> | undefined)?.Authorization).toBeUndefined()
    })

    it('preserva headers existentes al agregar Authorization', async () => {
      mockGetToken.mockReturnValue('mi-jwt-token')

      await wrapper.fetch('https://api.example.com/api/privado', {
        headers: { 'Content-Type': 'application/json' },
      })

      const [, init] = mockFetch.mock.calls[0]
      const headers = init?.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer mi-jwt-token')
      expect(headers['Content-Type']).toBe('application/json')
    })

    it('maneja correctamente un objeto Headers nativo', async () => {
      mockGetToken.mockReturnValue('mi-jwt-token')
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')

      await wrapper.fetch('https://api.example.com/api/privado', { headers })

      const [, init] = mockFetch.mock.calls[0]
      const resultHeaders = init?.headers as Record<string, string>
      expect(resultHeaders.Authorization).toBe('Bearer mi-jwt-token')
      expect(resultHeaders['content-type']).toBe('application/json')
    })

    it('funciona sin init previo', async () => {
      mockGetToken.mockReturnValue('mi-jwt-token')

      await wrapper.fetch('https://api.example.com/api/privado')

      const [, init] = mockFetch.mock.calls[0]
      const headers = init?.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer mi-jwt-token')
    })
  })

  describe('manejo de 401', () => {
    it('respuesta 401 en ruta privada ejecuta logout y redirige al login', async () => {
      mockGetToken.mockReturnValue('expired-token')
      mockFetch.mockResolvedValue({ status: 401 } as Response)

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith('/(auth)/login')
    })

    it('respuesta 401 en ruta pública NO ejecuta logout', async () => {
      mockGetToken.mockReturnValue(null)
      mockFetch.mockResolvedValue({ status: 401 } as Response)

      await wrapper.fetch('https://api.example.com/api/Auth/login')

      expect(mockLogout).not.toHaveBeenCalled()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })

    it('respuesta 200 no ejecuta logout', async () => {
      mockGetToken.mockReturnValue('valid-token')
      mockFetch.mockResolvedValue({ status: 200 } as Response)

      await wrapper.fetch('https://api.example.com/api/privado/recurso')

      expect(mockLogout).not.toHaveBeenCalled()
    })
  })

  describe('valor de retorno', () => {
    it('retorna la respuesta original del fetch', async () => {
      mockGetToken.mockReturnValue(null)
      const mockResponse = { status: 200, json: jest.fn() } as unknown as Response
      mockFetch.mockResolvedValue(mockResponse)

      const result = await wrapper.fetch('https://api.example.com/api/Auth/login')

      expect(result).toBe(mockResponse)
    })
  })
})
