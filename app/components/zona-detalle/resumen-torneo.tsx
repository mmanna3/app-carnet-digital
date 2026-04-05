import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { estiloAccentoPorColor } from '@/components/tarjeta-con-fondo-de-color'

function textoOGuion(s: string) {
  const t = s.trim()
  return t.length > 0 ? t : '—'
}

function lineaFaseZona(fase: string, zona: string) {
  const f = fase.trim()
  const z = zona.trim()
  if (!f && !z) return '—'
  if (!f) return z
  if (!z) return f
  return `${f} · ${z}`
}

export type ResumenTorneoProps = {
  torneo: string
  fase: string
  zona: string
  colorAgrupador?: string
}

export function ResumenTorneo({ torneo, fase, zona, colorAgrupador }: ResumenTorneoProps) {
  const accento = estiloAccentoPorColor(colorAgrupador)
  const colorIcono = accento.iconoColor

  return (
    <View className="mb-3 flex-row overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <View className={`w-1 ${accento.franja}`} />
      <View className="flex-1 gap-2 py-2.5 pl-2.5 pr-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="trophy-outline" size={18} color={colorIcono} />
          <Text
            className="flex-1 text-[15px] font-medium leading-5 text-gray-900"
            numberOfLines={2}
          >
            {textoOGuion(torneo)}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {/* <Ionicons name="map-outline" size={18} color={colorIcono} /> */}
          <Text
            className="flex-1 ml-7 text-[13px] font-medium leading-5 text-gray-500"
            numberOfLines={3}
          >
            {lineaFaseZona(fase, zona)}
          </Text>
        </View>
      </View>
    </View>
  )
}
