import React from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { getColorLiga600, useConfigLiga } from '@/lib/config/liga'
import { TarjetaConFondoDeColor } from '@/components/tarjeta-con-fondo-de-color'
import { useHeaderConHome } from '@/app/torneos/use-header-con-home'

export default function Torneos() {
  const router = useRouter()
  const configLiga = useConfigLiga()
  const leagueId = configLiga?.leagueId

  useHeaderConHome({ titulo: 'Torneos', backgroundColor: getColorLiga600() })

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
        <Text className="text-gray-600 text-center text-base">
          Seleccioná una liga para ver torneos.
        </Text>
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
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32 }}
    >
      {agrupadores.map((a) => (
        <View key={a.id ?? a.nombre} className="mb-6">
          {a.nombre ? (
            <Text className="mb-3 text-lg font-medium text-gray-700">{a.nombre}</Text>
          ) : null}
          {(a.torneos ?? []).map((torneo) => (
            <TarjetaConFondoDeColor
              key={torneo.id ?? torneo.nombre}
              nombre={torneo.nombre?.trim() || 'Sin nombre'}
              color={a.color}
              iconName="trophy"
              onPress={() =>
                router.push({
                  pathname: '/torneos/torneo-detalle',
                  params:
                    torneo.id != null
                      ? { torneoId: String(torneo.id) }
                      : {
                          torneoId: '',
                          agrupadorId: a.id != null ? String(a.id) : '',
                          torneoNombre: torneo.nombre ?? '',
                        },
                })
              }
            />
          ))}
        </View>
      ))}
    </ScrollView>
  )
}
