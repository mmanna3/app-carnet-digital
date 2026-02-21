import React from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'

interface Props extends TextInputProps {
  label?: string
}

export default function CampoTexto({ label, ...props }: Props) {
  return (
    <View>
      {label ? <Text className="text-gray-700 text-sm mb-1.5">{label}</Text> : null}
      <TextInput
        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  )
}
