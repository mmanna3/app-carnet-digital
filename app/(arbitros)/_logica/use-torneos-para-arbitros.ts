import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'

/** Torneos que el árbitro puede elegir al registrarse (endpoint público). */
export function useTorneosParaArbitros() {
  const { data, isLoading, isError, refetch } = useApiQuery({
    key: queryKeys.arbitros.torneos,
    fn: () => api.torneoAgrupadoresParaArbitros(),
  })

  return {
    torneos: data ?? [],
    cargando: isLoading,
    huboError: isError,
    reintentar: () => {
      void refetch()
    },
  }
}
