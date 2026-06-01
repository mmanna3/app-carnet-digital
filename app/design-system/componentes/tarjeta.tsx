import React from 'react'
import { View, StyleSheet, type ViewProps } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type Props = ViewProps & {
  className?: string
  children: React.ReactNode
  /** Degradado horizontal color → negro semitransparente (cards del home) */
  degradado?: readonly [string, string]
  borde?: string
  onPress?: never
}

export function Tarjeta({ className = '', degradado, borde, children, style, ...rest }: Props) {
  return (
    <View
      className={`glass overflow-hidden rounded-2xl p-5 ${className}`.trim()}
      style={[borde != null ? { borderWidth: 1.5, borderColor: borde } : undefined, style]}
      {...rest}
    >
      {degradado ? (
        <LinearGradient
          colors={[...degradado]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      {children}
    </View>
  )
}
