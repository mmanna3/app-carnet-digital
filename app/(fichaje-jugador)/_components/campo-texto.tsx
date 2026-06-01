import React, { useState } from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'

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
    ? 'border-red-500'
    : focused
      ? 'border-zinc-400'
      : 'border-zinc-700'

  return (
    // Android: evitar que el optimizador de vistas colapse el nodo y Maestro/E2E pierdan el testID.
    <View collapsable={false}>
      {label ? <Text className="text-zinc-300 text-sm mb-1.5">{label}</Text> : null}
      <TextInput
        testID={inputTestID}
        className={`w-full px-4 py-5 rounded-2xl bg-zinc-900/90 border text-zinc-100 ${borderClass}`}
        placeholderTextColor="#71717a"
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        {...props}
      />
      {error ? <Text className="text-red-500 text-sm mt-1">{error}</Text> : null}
    </View>
  )
}
