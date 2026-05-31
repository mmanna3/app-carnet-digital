import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { usePantallaGrande } from '@/lib/hooks/use-pantalla-grande'
import { getTemaAgrupador } from '@/lib/design-system'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import { Texto } from '@/components/ui/texto'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

type Props = {
  nombre: string
  color: string | undefined
  iconName: IoniconsName
  onPress?: () => void
}

export function estiloAccentoPorColor(color: string | undefined) {
  const tema = getTemaAgrupador(color)
  return {
    franja: tema.border,
    iconoFondo: tema.iconBg,
    iconoColor: tema.iconColor,
  }
}

function TarjetaCompacta({ nombre, color, iconName, onPress }: Props) {
  const tema = getTemaAgrupador(color)
  const contenido = (
    <View className={`glass flex-row items-center overflow-hidden rounded-2xl border ${tema.border} py-3 pl-3 pr-4`}>
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
  if (onPress) {
    return (
      <TouchableOpacity className="mb-2.5" onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
        {contenido}
      </TouchableOpacity>
    )
  }
  return <View className="mb-2.5">{contenido}</View>
}

export function TarjetaTorneo(props: Props) {
  const grande = usePantallaGrande()
  const [hovered, setHovered] = useState(false)

  if (!grande) {
    return <TarjetaCompacta {...props} />
  }

  const tema = getTemaAgrupador(props.color)
  const { nombre, iconName, onPress } = props

  const card = (
    <View
      className={`overflow-hidden rounded-2xl border ${tema.border} bg-white/5`}
      style={{
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.2)',
        transform: [{ translateY: hovered ? -3 : 0 }],
      } as object}
    >
      <View className="items-center px-5 py-7">
        <View
          className={`mb-4 h-[72px] w-[72px] items-center justify-center rounded-2xl border ${tema.border} ${tema.iconBg}`}
        >
          <Ionicons name={iconName} size={36} color={tema.iconColor} />
        </View>
        <Text
          style={{
            fontFamily: FUENTE_DISPLAY,
            fontSize: 16,
            color: '#f4f4f5',
            textAlign: 'center',
            lineHeight: 22,
          }}
          numberOfLines={3}
        >
          {nombre}
        </Text>
      </View>
    </View>
  )

  return (
    <Pressable
      style={{ marginBottom: 10, cursor: onPress ? 'pointer' : undefined } as object}
      onPress={onPress}
      // @ts-expect-error web mouse events
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {card}
    </Pressable>
  )
}
