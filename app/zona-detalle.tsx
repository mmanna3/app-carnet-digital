import React, { useLayoutEffect, useMemo, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getColorLiga600, hexCabeceraPorColorAgrupadorApi } from '@/lib/config/liga'

type IconName = ComponentProps<typeof Ionicons>['name']

const TABS: { titulo: string; icon: IconName }[] = [
  { titulo: 'Posiciones', icon: 'trophy-outline' },
  { titulo: 'Fixture', icon: 'calendar-outline' },
  { titulo: 'Jornadas', icon: 'football-outline' },
  { titulo: 'Clubes', icon: 'shield-half-outline' },
]

export default function ZonaDetalle() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [tabIndex, setTabIndex] = useState(0)

  const { color } = useLocalSearchParams<{
    zonaNombre?: string
    color?: string
  }>()

  const colorAgrupador = color != null && String(color).length > 0 ? String(color) : undefined

  const tituloHeader = TABS[tabIndex]?.titulo ?? 'Zona'

  const colorIconoActivo = useMemo(() => {
    return colorAgrupador ? hexCabeceraPorColorAgrupadorApi(colorAgrupador) : getColorLiga600()
  }, [colorAgrupador])

  useLayoutEffect(() => {
    const fondo = colorAgrupador
      ? hexCabeceraPorColorAgrupadorApi(colorAgrupador)
      : getColorLiga600()
    navigation.setOptions({
      title: tituloHeader,
      headerStyle: { backgroundColor: fondo },
      headerTintColor: '#ffffff',
      headerTitleStyle: { color: '#ffffff', fontWeight: '600', fontSize: 17 },
      headerShadowVisible: false,
    })
  }, [navigation, tituloHeader, colorAgrupador])

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1" />

      <View
        className="flex-row border-t border-gray-200 bg-white"
        style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      >
        {TABS.map((t, i) => {
          const activo = i === tabIndex
          return (
            <TouchableOpacity
              key={t.titulo}
              className="flex-1 items-center justify-center py-3"
              onPress={() => setTabIndex(i)}
              accessibilityRole="tab"
              accessibilityLabel={t.titulo}
              accessibilityState={{ selected: activo }}
            >
              <Ionicons name={t.icon} size={26} color={activo ? colorIconoActivo : '#9ca3af'} />
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
