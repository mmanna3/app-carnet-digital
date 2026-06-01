import React from 'react'
import { Text, type TextProps } from 'react-native'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'

type Props = TextProps & {
  className?: string
  children: React.ReactNode
}

/** Título de sección en wizards (fondo oscuro). Tipografía Coalition. */
export function Titulo({ className = '', style, children, ...rest }: Props) {
  return (
    <Text
      className={`mb-1 text-lg text-zinc-100 ${className}`.trim()}
      style={[{ fontFamily: FUENTE_DISPLAY }, style]}
      {...rest}
    >
      {children}
    </Text>
  )
}
