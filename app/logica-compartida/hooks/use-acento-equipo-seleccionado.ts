import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useAuth } from '@/lib/hooks/use-auth'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { hexAcentoEquipo, temaFranjaEquipo } from '@/lib/utilidades/color-carnet'

export function useAcentoEquipoSeleccionado() {
  const { equipoSeleccionadoId } = useEquipoStore()
  const { isAuthenticated } = useAuth()

  const { data: jugadores } = useApiQuery({
    key: queryKeys.carnets.byEquipo(equipoSeleccionadoId),
    fn: async () => {
      if (!equipoSeleccionadoId) throw new Error('No hay equipo seleccionado')
      return await api.carnets(equipoSeleccionadoId)
    },
    transformarResultado: (resultado) => resultado,
    activado: !!equipoSeleccionadoId && isAuthenticated,
  })

  const lista = jugadores ?? []

  return {
    jugadores,
    temaFranja: temaFranjaEquipo(lista),
    hexAcento: hexAcentoEquipo(lista),
  }
}
