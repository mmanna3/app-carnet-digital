import React, { useMemo } from 'react'
import { View, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { TarjetaTorneo } from '@/components/torneos/tarjeta-torneo'
import type { InformacionInicialAgrupadorDTO } from '@/lib/api/clients'
import { useHeaderConHome } from '@/app/torneos/use-header-con-home'
import { usePantallaGrande } from '@/lib/hooks/use-pantalla-grande'
import { EstadoCarga, EstadoVacio, Texto } from '@/components/ui'

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
  const fases = torneo.fases ?? []

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
      {fases.map((fase) => (
        <View key={fase.id ?? fase.nombre} className="mb-6">
          {fase.nombre ? (
            <Texto variante="eyebrow" className="mb-3 text-base text-zinc-300 normal-case tracking-wide">
              {fase.nombre}
            </Texto>
          ) : null}
          <View style={grande ? { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } : undefined}>
            {(fase.zonas ?? []).map((zona) => (
              <View
                key={zona.id ?? zona.nombre}
                style={grande ? { flex: 1, minWidth: '30%', maxWidth: '33.33%' } : undefined}
              >
                <TarjetaTorneo
                  nombre={zona.nombre?.trim() || 'Sin nombre'}
                  color={color}
                  iconName="map"
                  onPress={() =>
                    router.push({
                      pathname: '/torneos/zona-detalle',
                      params: {
                        torneoId: String(torneo.id ?? ''),
                        zonaId: zona.id != null ? String(zona.id) : '',
                        zonaNombre: zona.nombre ?? '',
                        color: color ?? '',
                        torneoNombre: torneo.nombre ?? '',
                        faseNombre: fase.nombre ?? '',
                        tipoDeFase: fase.tipoDeFase ?? '',
                      },
                    })
                  }
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}
