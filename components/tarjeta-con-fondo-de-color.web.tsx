import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type EstiloAccento = {
  franja: string
  iconoFondo: string
  iconoColor: string
}

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

/** @deprecated Preferir estiloAccentoPorColor */
export function colorFondoAgrupador(color: string | undefined): string {
  return estiloAccentoPorColor(color).franja
}

function hexesPorColor(color: string | undefined) {
  const c = (color ?? '').trim().toLowerCase()
  if (c === 'verde')
    return {
      acento: '#16a34a',
      cardBg: '#f0fdf4',
      iconoBg: 'rgba(21,128,61,0.12)',
      iconoColor: '#15803d',
    }
  if (c === 'rojo')
    return {
      acento: '#dc2626',
      cardBg: '#fef2f2',
      iconoBg: 'rgba(185,28,28,0.12)',
      iconoColor: '#b91c1c',
    }
  if (c === 'azul')
    return {
      acento: '#2563eb',
      cardBg: '#eff6ff',
      iconoBg: 'rgba(29,78,216,0.12)',
      iconoColor: '#1d4ed8',
    }
  return {
    acento: '#9ca3af',
    cardBg: '#f9fafb',
    iconoBg: 'rgba(156,163,175,0.15)',
    iconoColor: '#374151',
  }
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

type Props = {
  nombre: string
  color: string | undefined
  iconName: IoniconsName
  onPress?: () => void
}

export function TarjetaConFondoDeColor({ nombre, color, iconName, onPress }: Props) {
  const [hovered, setHovered] = useState(false)
  const { acento, cardBg, iconoBg, iconoColor } = hexesPorColor(color)

  const card = (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: hovered ? acento + '55' : acento + '30',
        overflow: 'hidden',
        // @ts-ignore — web-only
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.13)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform: [{ translateY: hovered ? -3 : 0 }],
        transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
      }}
    >
      {/* Colored top accent bar */}
      <View style={{ height: 6, backgroundColor: acento }} />

      {/* Card body */}
      <View style={{ alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 }}>
        {/* Icon container */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: iconoBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Ionicons name={iconName} size={36} color={iconoColor} />
        </View>

        {/* Name */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: iconoColor,
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

  if (onPress) {
    return (
      <Pressable
        style={{ marginBottom: 10, cursor: 'pointer' } as object}
        onPress={onPress}
        // @ts-ignore — web-only mouse events
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        accessibilityRole="button"
      >
        {card}
      </Pressable>
    )
  }

  return <View style={{ marginBottom: 10 }}>{card}</View>
}
