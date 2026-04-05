import React from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'

/** Mapea `color` del API (Verde, Rojo, Azul) a clases Tailwind. */
function colorFondoAgrupador(color: string | undefined): string {
  const c = (color ?? '').trim().toLowerCase()
  if (c === 'verde') return 'bg-verde-600'
  if (c === 'rojo') return 'bg-rojo-600'
  if (c === 'azul') return 'bg-azul-600'
  return 'bg-gray-600'
}

function TarjetaTorneo({
  nombre,
  colorAgrupador,
}: {
  nombre: string
  colorAgrupador: string | undefined
}) {
  const bgClass = colorFondoAgrupador(colorAgrupador)

  return (
    <View className={`mb-3 overflow-hidden rounded-2xl ${bgClass}`}>
      <View
        className="absolute rounded-full bg-white/10"
        style={{ top: -48, right: -48, width: 144, height: 144 }}
      />
      <View
        className="absolute rounded-full bg-white/10"
        style={{ bottom: -36, left: -36, width: 112, height: 112 }}
      />
      <View className="flex-row items-center px-4 py-4">
        <Ionicons name="trophy" size={22} color="#ffffff" style={{ marginRight: 10 }} />
        <Text className="flex-1 text-base font-semibold text-white leading-6">{nombre}</Text>
      </View>
    </View>
  )
}

export default function Torneos() {
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

  if (!leagueId) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-gray-600 text-center text-base">Seleccioná una liga para ver torneos.</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center gap-3">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-base text-gray-600">Cargando torneos...</Text>
      </View>
    )
  }

  if (isError || !agrupadores) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-gray-600 text-center text-base">
          No se pudo cargar la información de torneos.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 32 }}
    >
      {agrupadores.map((a) => (
        <View key={a.id ?? a.nombre} className="mb-6">
          {a.nombre ? (
            <Text className="text-lg font-semibold text-gray-900 mb-3">{a.nombre}</Text>
          ) : null}
          {(a.torneos ?? []).map((torneo) => (
            <TarjetaTorneo
              key={torneo.id ?? torneo.nombre}
              nombre={torneo.nombre?.trim() || 'Sin nombre'}
              colorAgrupador={a.color}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  )
}
