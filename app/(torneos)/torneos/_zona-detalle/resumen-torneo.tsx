import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { hexIconoAgrupador } from '@/lib/design-system'
import { Texto } from '@/design-system/componentes/texto'

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
        <Texto className="text-center text-lg ml-3" numberOfLines={3}>
          {lineaFaseZona(fase, zona)}
        </Texto>
      </View>
    </View>
  )
}
