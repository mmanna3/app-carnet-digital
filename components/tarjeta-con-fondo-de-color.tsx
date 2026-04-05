import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/** Mapea `color` del API (Verde, Rojo, Azul) a clases Tailwind. */
export function colorFondoAgrupador(color: string | undefined): string {
  const c = (color ?? '').trim().toLowerCase()
  if (c === 'verde') return 'bg-verde-600'
  if (c === 'rojo') return 'bg-rojo-600'
  if (c === 'azul') return 'bg-azul-600'
  return 'bg-gray-600'
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

type Props = {
  nombre: string
  color: string | undefined
  iconName: IoniconsName
  onPress?: () => void
}

export function TarjetaConFondoDeColor({ nombre, color, iconName, onPress }: Props) {
  const bgClass = colorFondoAgrupador(color)

  const inner = (
    <>
      <View className="flex-row items-center px-4 py-4">
        <Ionicons name={iconName} size={22} color="#ffffff" style={{ marginRight: 10 }} />
        <Text className="flex-1 text-base font-semibold text-white leading-6">{nombre}</Text>
      </View>
    </>
  )

  const className = `mb-3 overflow-hidden rounded-2xl ${bgClass}`

  if (onPress) {
    return (
      <TouchableOpacity className={className} onPress={onPress} activeOpacity={0.85} accessibilityRole="button">
        {inner}
      </TouchableOpacity>
    )
  }

  return <View className={className}>{inner}</View>
}
