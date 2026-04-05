import React from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
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
  const { width: anchoVentana } = useWindowDimensions()
  const accento = estiloAccentoPorColor(colorAgrupador)
  const colorIcono = accento.iconoColor
  /** Ancho máximo del título: el bloque copa+título queda junto y centrado (sin flex-1 que separa ícono y texto). */
  const anchoMaxTitulo = Math.max(120, anchoVentana - 64)

  return (
    <View className="my-3 overflow-hidden">
      <View className="w-full items-center gap-2">
        <View className="flex-row items-center gap-2 self-center" style={{ maxWidth: '100%' }}>
          <Ionicons name="trophy-outline" size={16} color={colorIcono} />
          <Text
            className="text-left text-[14px] font-medium leading-5 text-gray-900"
            numberOfLines={2}
            style={{ maxWidth: anchoMaxTitulo }}
          >
            {textoOGuion(torneo)}
          </Text>
        </View>
        <Text
          className="text-center text-[12px] font-medium leading-5 text-gray-500 ml-3"
          numberOfLines={3}
        >
          {lineaFaseZona(fase, zona)}
        </Text>
      </View>
    </View>
  )
}
