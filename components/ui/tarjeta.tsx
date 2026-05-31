import React from 'react'
import { View, type ViewProps } from 'react-native'

type Props = ViewProps & {
  className?: string
  children: React.ReactNode
  onPress?: never
}

export function Tarjeta({ className = '', children, ...rest }: Props) {
  return (
    <View className={`glass rounded-2xl p-5 ${className}`.trim()} {...rest}>
      {children}
    </View>
  )
}
