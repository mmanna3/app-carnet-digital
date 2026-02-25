import React, { useState } from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'

interface Props extends TextInputProps {
  label?: string
  inputTestID?: string
}

export default function CampoTexto({ label, inputTestID, onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <View>
      {label ? <Text className="text-gray-700 text-sm mb-1.5">{label}</Text> : null}
      <TextInput
        testID={inputTestID}
        className={`w-full px-4 py-5 rounded-2xl bg-gray-50 border-2 text-gray-900 ${focused ? 'border-liga-600' : 'border-gray-200'}`}
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
    </View>
  )
}
