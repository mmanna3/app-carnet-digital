import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type EstiloAccento = {
  franja: string
  iconoFondo: string
  iconoColor: string
}

/** Verde / Rojo / Azul del API → acento sutil (franja + icono), no bloques enteros de color. */
export function estiloAccentoPorColor(color: string | undefined): EstiloAccento {
  const c = (color ?? '').trim().toLowerCase()
  if (c === 'verde') {
    return { franja: 'bg-verde-600', iconoFondo: 'bg-verde-50', iconoColor: '#15803d' }
  }
  if (c === 'rojo') {
    return { franja: 'bg-rojo-600', iconoFondo: 'bg-rojo-50', iconoColor: '#b91c1c' }
  }
  if (c === 'azul') {
    return { franja: 'bg-azul-600', iconoFondo: 'bg-azul-50', iconoColor: '#1d4ed8' }
  }
  return { franja: 'bg-gray-400', iconoFondo: 'bg-gray-100', iconoColor: '#374151' }
}

/** @deprecated Preferir estiloAccentoPorColor; se mantiene compat. con código que esperaba clase bg-*-600. */
export function colorFondoAgrupador(color: string | undefined): string {
  return estiloAccentoPorColor(color).franja
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

type Props = {
  nombre: string
  color: string | undefined
  iconName: IoniconsName
  onPress?: () => void
}

export function TarjetaConFondoDeColor({ nombre, color, iconName, onPress }: Props) {
  const accento = estiloAccentoPorColor(color)

  const contenido = (
    <View className="flex-row items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <View className={`w-1 ${accento.franja}`} />
      <View className="min-h-[52px] flex-1 flex-row items-center py-3 pl-3 pr-3">
        <View
          className={`mr-3 h-10 w-10 items-center justify-center rounded-lg ${accento.iconoFondo}`}
        >
          <Ionicons name={iconName} size={20} color={accento.iconoColor} />
        </View>
        <Text className="flex-1 text-[15px] font-medium leading-5 text-gray-900" numberOfLines={3}>
          {nombre}
        </Text>
      </View>
    </View>
  )

  const envoltorio = `mb-2.5`

  if (onPress) {
    return (
      <TouchableOpacity
        className={envoltorio}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        {contenido}
      </TouchableOpacity>
    )
  }

  return <View className={envoltorio}>{contenido}</View>
}
