import React from 'react'
import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { api } from '@/lib/api/api'
import { useTorneosParaArbitros } from '@/arbitros/_logica/use-torneos-para-arbitros'

jest.mock('@/lib/api/api', () => ({ api: { torneoAgrupadoresParaArbitros: jest.fn() } }))

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useTorneosParaArbitros', () => {
  beforeEach(() => jest.clearAllMocks())

  it('arranca cargando y devuelve los torneos', async () => {
    ;(api.torneoAgrupadoresParaArbitros as jest.Mock).mockResolvedValue([{ id: 1, nombre: 'A' }])
    const { result } = renderHook(() => useTorneosParaArbitros(), { wrapper })

    expect(result.current.cargando).toBe(true)
    await waitFor(() => expect(result.current.cargando).toBe(false))
    expect(result.current.torneos).toEqual([{ id: 1, nombre: 'A' }])
    expect(result.current.huboError).toBe(false)
  })

  it('informa el error y reintenta', async () => {
    ;(api.torneoAgrupadoresParaArbitros as jest.Mock)
      .mockRejectedValueOnce(new Error('sin red'))
      .mockResolvedValueOnce([{ id: 2, nombre: 'B' }])
    const { result } = renderHook(() => useTorneosParaArbitros(), { wrapper })

    await waitFor(() => expect(result.current.huboError).toBe(true))
    result.current.reintentar()
    await waitFor(() => expect(result.current.torneos).toEqual([{ id: 2, nombre: 'B' }]))
  })

  it('devuelve lista vacía si el back no tiene torneos', async () => {
    ;(api.torneoAgrupadoresParaArbitros as jest.Mock).mockResolvedValue([])
    const { result } = renderHook(() => useTorneosParaArbitros(), { wrapper })

    await waitFor(() => expect(result.current.cargando).toBe(false))
    expect(result.current.torneos).toEqual([])
  })
})
