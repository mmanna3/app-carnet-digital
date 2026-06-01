import React, { useState } from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'
import { TEMAS_TARJETA_ACCION } from '@/design-system/tokens/tarjeta-accion'

const bordeVerde = TEMAS_TARJETA_ACCION.verde.borde

interface Props extends TextInputProps {
  label?: string
  inputTestID?: string
  error?: string
}

export default function CampoTexto({
  label,
  inputTestID,
  error,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false)
  const tieneError = !!error

  const borderClass = tieneError
    ? 'border-red-500/80'
    : focused
      ? 'border-green-400/80'
      : 'border-border-glass'

  return (
    // Android: evitar que el optimizador de vistas colapse el nodo y Maestro/E2E pierdan el testID.
    <View collapsable={false}>
      {label ? <Text className="mb-1.5 text-sm text-zinc-400">{label}</Text> : null}
      <TextInput
        testID={inputTestID}
        className={`glass w-full rounded-2xl border px-4 py-5 text-zinc-100 ${borderClass}`}
        placeholderTextColor="#71717a"
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        style={focused && !tieneError ? { borderColor: bordeVerde } : undefined}
        {...props}
      />
      {error ? <Text className="mt-1 text-sm text-red-400">{error}</Text> : null}
    </View>
  )
}
