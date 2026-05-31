import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getTemaAgrupador } from '@/lib/design-system'
import { Texto } from '@/components/ui/texto'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

type Props = {
  nombre: string
  color: string | undefined
  iconName: IoniconsName
  onPress?: () => void
}

export function TarjetaTorneo({ nombre, color, iconName, onPress }: Props) {
  const tema = getTemaAgrupador(color)

  const contenido = (
    <View
      className={`glass flex-row items-center overflow-hidden rounded-2xl border ${tema.border} py-3 pl-3 pr-4`}
    >
      <View
        className={`mr-3 h-10 w-10 items-center justify-center rounded-lg border ${tema.border} ${tema.iconBg}`}
      >
        <Ionicons name={iconName} size={20} color={tema.iconColor} />
      </View>
      <Texto variante="titulo" className="flex-1 text-[15px] leading-5" numberOfLines={3}>
        {nombre}
      </Texto>
    </View>
  )

  const envoltorio = 'mb-2.5'

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

/** @deprecated Usar getTemaAgrupador */
export function estiloAccentoPorColor(color: string | undefined) {
  const tema = getTemaAgrupador(color)
  return {
    franja: tema.border,
    iconoFondo: tema.iconBg,
    iconoColor: tema.iconColor,
  }
}
