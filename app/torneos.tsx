import React, { useLayoutEffect } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter, useNavigation } from 'expo-router'
import { Entypo, Ionicons } from '@expo/vector-icons'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { getColorLiga600, useConfigLiga } from '@/lib/config/liga'
import { TarjetaConFondoDeColor } from '@/components/tarjeta-con-fondo-de-color'

export default function Torneos() {
  const router = useRouter()
  const navigation = useNavigation()
  const configLiga = useConfigLiga()
  const leagueId = configLiga?.leagueId

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Torneos',
      headerStyle: { backgroundColor: getColorLiga600() },
      headerTintColor: '#ffffff',
      headerTitleStyle: { color: '#ffffff', fontWeight: '600', fontSize: 17 },
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.replace('/home')}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Entypo name="home" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
    })
  }, [navigation, router, configLiga?.leagueId])

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
                  pathname: '/torneo-detalle',
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
