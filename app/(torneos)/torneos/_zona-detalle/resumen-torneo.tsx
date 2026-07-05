import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { hexIconoAgrupador } from '@/lib/design-system'
import { Texto } from '@/design-system/componentes/texto'
import { textoOGuion } from '@/lib/utilidades/recursos-api'

export function lineaContextoZona(partes: {
  grupoDeFases?: string
  subgrupo?: string
  fase?: string
  zona?: string
}) {
  const segmentos = [partes.grupoDeFases, partes.subgrupo, partes.fase, partes.zona]
    .map((s) => s?.trim())
    .filter(Boolean)

  if (segmentos.length === 0) return '—'
  return segmentos.join(' · ')
}

export type ResumenTorneoProps = {
  torneo: string
  fase: string
  zona: string
  grupoDeFases?: string
  subgrupo?: string
  colorAgrupador?: string
}

export function ResumenTorneo({
  torneo,
  fase,
  zona,
  grupoDeFases,
  subgrupo,
  colorAgrupador,
}: ResumenTorneoProps) {
  const { width: anchoVentana } = useWindowDimensions()
  const colorIcono = hexIconoAgrupador(colorAgrupador)
  const anchoMaxTitulo = Math.max(120, anchoVentana - 64)

  return (
    <View className="mb-5 overflow-hidden">
      <View className="w-full items-center gap-2">
        <View className="flex-row items-center gap-2.5 self-center" style={{ maxWidth: '100%' }}>
          <Ionicons name="trophy-outline" size={20} color={colorIcono} />
          <Texto
            variante="titulo"
            className="text-left text-lg leading-7 mb-[-2]"
            numberOfLines={2}
            style={{ maxWidth: anchoMaxTitulo }}
          >
            {textoOGuion(torneo)}
          </Texto>
        </View>
        <Texto className="text-center text-lg ml-3" numberOfLines={4}>
          {lineaContextoZona({ grupoDeFases, subgrupo, fase, zona })}
        </Texto>
      </View>
    </View>
  )
}
