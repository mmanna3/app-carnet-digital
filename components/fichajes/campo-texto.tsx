import React, { useState } from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'

interface Props extends TextInputProps {
  label?: string
  inputTestID?: string
  error?: string
}

export default function CampoTexto({ label, inputTestID, error, onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false)
  const tieneError = !!error

  const borderClass = tieneError
    ? 'border-red-500'
    : focused
      ? 'border-liga-600'
      : 'border-gray-200'

  return (
    <View>
      {label ? <Text className="text-gray-700 text-sm mb-1.5">{label}</Text> : null}
      <TextInput
        testID={inputTestID}
        className={`w-full px-4 py-5 rounded-2xl bg-gray-50 border-2 text-gray-900 ${borderClass}`}
        placeholderTextColor="#9ca3af"
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
