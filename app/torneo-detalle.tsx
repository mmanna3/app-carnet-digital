import React, { useLayoutEffect, useMemo } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { TarjetaConFondoDeColor } from '@/components/tarjeta-con-fondo-de-color'
import type { InformacionInicialAgrupadorDTO } from '@/lib/api/clients'

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
  const navigation = useNavigation()
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

  useLayoutEffect(() => {
    const titulo = resuelto?.torneo?.nombre?.trim() || 'Torneo'
    navigation.setOptions({ title: titulo })
  }, [navigation, resuelto?.torneo?.nombre])

  if (!leagueId) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-gray-600 text-center text-base">Seleccioná una liga.</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center gap-3">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-base text-gray-600">Cargando...</Text>
      </View>
    )
  }

  if (isError || !agrupadores) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-gray-600 text-center text-base">No se pudo cargar el torneo.</Text>
      </View>
    )
  }

  if (!resuelto) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-gray-600 text-center text-base">No encontramos ese torneo.</Text>
      </View>
    )
  }

  const { torneo, color } = resuelto
  const fases = torneo.fases ?? []

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 32 }}
    >
      {fases.map((fase) => (
        <View key={fase.id ?? fase.nombre} className="mb-6">
          {fase.nombre ? (
            <Text className="mb-3 text-lg font-medium text-gray-700">{fase.nombre}</Text>
          ) : null}
          {(fase.zonas ?? []).map((zona) => (
            <TarjetaConFondoDeColor
              key={zona.id ?? zona.nombre}
              nombre={zona.nombre?.trim() || 'Sin nombre'}
              color={color}
              iconName="map"
            />
          ))}
        </View>
      ))}
    </ScrollView>
  )
}
