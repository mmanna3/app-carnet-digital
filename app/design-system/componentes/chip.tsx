import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

type Props = {
  label: string
  activo?: boolean
  onPress?: () => void
  classNameActivo?: string
  classNameInactivo?: string
}

export function Chip({
  label,
  activo = false,
  onPress,
  classNameActivo = 'bg-accent-hot',
  classNameInactivo = 'bg-white/10 border border-border-glass',
}: Props) {
  const base = 'rounded-full px-4 py-2'
  const estilo = activo ? classNameActivo : classNameInactivo
  const texto = activo ? 'text-black font-semibold' : 'text-zinc-400 font-medium'

  const contenido = <Text className={`text-sm ${texto}`}>{label}</Text>

  if (onPress) {
    return (
      <TouchableOpacity
        className={`${base} ${estilo}`}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityState={{ selected: activo }}
      >
        {contenido}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity className={`${base} ${estilo}`} disabled>
      {contenido}
    </TouchableOpacity>
  )
}
