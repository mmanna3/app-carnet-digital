import React from 'react'
import { Text, type TextProps } from 'react-native'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'

type Props = TextProps & {
  className?: string
  children: React.ReactNode
}

/** Título de sección en wizards con fondo claro. Tipografía Coalition. */
export function Titulo({ className = '', style, children, ...rest }: Props) {
  return (
    <Text
      className={`mb-1 text-lg text-gray-900 ${className}`.trim()}
      style={[{ fontFamily: FUENTE_DISPLAY }, style]}
      {...rest}
    >
      {children}
    </Text>
  )
}
