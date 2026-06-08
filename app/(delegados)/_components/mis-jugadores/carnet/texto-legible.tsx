import React from 'react'
import { Text, type TextProps } from 'react-native'
import { FUENTE_SANS_BOLD } from '@/lib/design-system/fuentes'

export function TextoLegible({
  className = '',
  style,
  children,
  ...rest
}: TextProps & { children: React.ReactNode }) {
  return (
    <Text className={className} style={[{ fontFamily: FUENTE_SANS_BOLD }, style]} {...rest}>
      {children}
    </Text>
  )
}
