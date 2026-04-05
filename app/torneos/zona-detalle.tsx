import React, { useMemo, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getColorLiga600, hexCabeceraPorColorAgrupadorApi } from '@/lib/config/liga'
import Clubes from '@/app/torneos/zona-detalle/clubes'
import Fixture from '@/app/torneos/zona-detalle/fixture'
import Jornadas from '@/app/torneos/zona-detalle/jornadas'
import Posiciones from '@/app/torneos/zona-detalle/posiciones'
import { ResumenTorneo } from '@/app/torneos/zona-detalle/resumen-torneo'
import { useHeaderConHome } from '@/app/torneos/use-header-con-home'

type IconName = ComponentProps<typeof Ionicons>['name']

const TABS: { titulo: string; icon: IconName; Contenido: React.ComponentType }[] = [
  { titulo: 'Posiciones', icon: 'trophy-outline', Contenido: Posiciones },
  { titulo: 'Fixture', icon: 'calendar-outline', Contenido: Fixture },
  { titulo: 'Jornadas', icon: 'football-outline', Contenido: Jornadas },
  { titulo: 'Clubes', icon: 'shield-half-outline', Contenido: Clubes },
]

export default function ZonaDetalle() {
  const insets = useSafeAreaInsets()
  const [tabIndex, setTabIndex] = useState(0)

  const { color, torneoNombre, faseNombre, zonaNombre } = useLocalSearchParams<{
    zonaNombre?: string
    color?: string
    torneoNombre?: string
    faseNombre?: string
  }>()

  const colorAgrupador = color != null && String(color).length > 0 ? String(color) : undefined

  const tituloHeader = TABS[tabIndex]?.titulo ?? 'Zona'

  const colorIconoActivo = useMemo(() => {
    return colorAgrupador ? hexCabeceraPorColorAgrupadorApi(colorAgrupador) : getColorLiga600()
  }, [colorAgrupador])

  const backgroundColor = colorAgrupador
    ? hexCabeceraPorColorAgrupadorApi(colorAgrupador)
    : getColorLiga600()

  useHeaderConHome({ titulo: tituloHeader, backgroundColor })

  const Contenido = TABS[tabIndex]?.Contenido ?? Posiciones

  const textoTorneo = torneoNombre != null ? String(torneoNombre) : ''
  const textoFase = faseNombre != null ? String(faseNombre) : ''
  const textoZona = zonaNombre != null ? String(zonaNombre) : ''

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 px-4 pt-6">
        <ResumenTorneo
          torneo={textoTorneo}
          fase={textoFase}
          zona={textoZona}
          colorAgrupador={colorAgrupador}
        />
        <View className="flex-1">
          <Contenido />
        </View>
      </View>

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
