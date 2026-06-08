import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { queryKeys } from '@/lib/api/query-keys'

export function useCarnetsEquipo() {
  const { equipoSeleccionadoId } = useEquipoStore()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: jugadores,
    isLoading,
    isError,
  } = useApiQuery({
    key: queryKeys.carnets.byEquipo(equipoSeleccionadoId),
    fn: async () => {
      if (!equipoSeleccionadoId) throw new Error('No hay equipo seleccionado')
      return await api.carnets(equipoSeleccionadoId)
    },
    transformarResultado: (resultado) => resultado,
    activado: !!equipoSeleccionadoId && isAuthenticated,
  })

  const invalidarCarnets = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) })
  }, [queryClient, equipoSeleccionadoId])

  const handleActualizar = useCallback(async () => {
    if (!equipoSeleccionadoId) return
    setRefreshing(true)
    try {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) }),
        queryClient.refetchQueries({
          queryKey: queryKeys.jugadores.pendientes(equipoSeleccionadoId),
        }),
      ])
    } finally {
      setRefreshing(false)
    }
  }, [equipoSeleccionadoId, queryClient])

  return {
    equipoSeleccionadoId,
    isAuthenticated,
    jugadores: jugadores ?? [],
    isLoading,
    isError,
    refreshing,
    handleActualizar,
    invalidarCarnets,
  }
}
