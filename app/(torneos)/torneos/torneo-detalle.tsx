import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import type { InformacionInicialAgrupadorDTO } from '@/lib/api/clients'
import { useHeaderConHome } from '@/torneos/_components/cabecera-publica'
import { usePantallaGrande } from '@/lib/hooks/use-pantalla-grande'
import { EstadoCarga, EstadoVacio } from '@/design-system/componentes'
import { RUTAS } from '@/logica-compartida/constantes/rutas'
import { ListaElementosTorneo, contarFases } from '@/torneos/_components/seccion-grupo-fases'

function buscarTorneoEnAgrupadores(
  agrupadores: InformacionInicialAgrupadorDTO[],
  torneoId: string | undefined,
  agrupadorId: string | undefined,
  torneoNombre: string | undefined
) {
  if (torneoId) {
    const idBuscado = Number(torneoId)
    if (!Number.isNaN(idBuscado)) {
      for (const a of agrupadores) {
        const t = a.torneos?.find((tor) => tor.id === idBuscado)
        if (t) return { torneo: t, color: a.color }
      }
    }
  }
  if (agrupadorId && torneoNombre !== undefined && torneoNombre !== '') {
    const aid = Number(agrupadorId)
    if (!Number.isNaN(aid)) {
      const a = agrupadores.find((ag) => ag.id === aid)
      const t = a?.torneos?.find((tor) => (tor.nombre ?? '') === torneoNombre)
      if (t && a) return { torneo: t, color: a.color }
    }
  }
  return null
}

export default function TorneoDetalle() {
  const router = useRouter()
  const grande = usePantallaGrande()
  const { torneoId, agrupadorId, torneoNombre } = useLocalSearchParams<{
    torneoId: string
    agrupadorId?: string
    torneoNombre?: string
  }>()
  const configLiga = useConfigLiga()
  const leagueId = configLiga?.leagueId

  const {
    data: agrupadores,
    isLoading,
    isError,
  } = useApiQuery({
    key: queryKeys.torneos.infoInicial(leagueId),
    fn: () => api.infoInicialDeTorneos(),
    activado: !!leagueId,
  })

  const resuelto = useMemo(() => {
    if (!agrupadores) return null
    return buscarTorneoEnAgrupadores(agrupadores, torneoId, agrupadorId, torneoNombre)
  }, [agrupadores, torneoId, agrupadorId, torneoNombre])

  const titulo = resuelto?.torneo?.nombre?.trim() || 'Torneo'

  useHeaderConHome({ titulo })

  if (!leagueId) {
    return <EstadoVacio mensaje="Seleccioná una liga." />
  }

  if (isLoading) {
    return <EstadoCarga mensaje="Cargando..." />
  }

  if (isError || !agrupadores) {
    return <EstadoVacio mensaje="No se pudo cargar el torneo." />
  }

  if (!resuelto) {
    return <EstadoVacio mensaje="No encontramos ese torneo." />
  }

  const { torneo, color } = resuelto
  const elementos = torneo.elementos ?? []
  const expandidoInicialHabilitado = contarFases(elementos) === 1

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
        maxWidth: 1280,
        marginHorizontal: 'auto',
        width: '100%',
      }}
    >
      <ListaElementosTorneo
        elementos={elementos}
        torneoId={torneo.id}
        torneoNombre={torneo.nombre ?? ''}
        color={color}
        grande={grande}
        esRaiz
        expandidoInicialHabilitado={expandidoInicialHabilitado}
        onNavegarZona={({
          torneoId,
          zonaId,
          zonaNombre,
          faseNombre,
          tipoDeFase,
          grupoDeFasesNombre,
          subgrupoNombre,
        }) =>
          router.push({
            pathname: RUTAS.ZONA_DETALLE,
            params: {
              torneoId,
              zonaId,
              zonaNombre,
              color: color ?? '',
              torneoNombre: torneo.nombre ?? '',
              faseNombre,
              tipoDeFase,
              grupoDeFasesNombre: grupoDeFasesNombre ?? '',
              subgrupoNombre: subgrupoNombre ?? '',
            },
          })
        }
      />
    </ScrollView>
  )
}
