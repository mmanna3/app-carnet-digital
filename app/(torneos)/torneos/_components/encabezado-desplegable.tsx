import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Texto } from '@/design-system/componentes'

type VarianteEncabezado = 'subgrupo' | 'fase'

interface EncabezadoDesplegableProps {
  titulo: string
  expandido: boolean
  onToggle: () => void
  color?: string
  variante?: VarianteEncabezado
  testID?: string
  nivelIndentacion?: number
}

export function EncabezadoDesplegable({
  titulo,
  expandido,
  onToggle,
  variante = 'fase',
  testID,
  nivelIndentacion = 0,
}: EncabezadoDesplegableProps) {
  const chevronName = expandido ? 'chevron-down' : 'chevron-forward'
  const paddingLeft = nivelIndentacion > 0 ? nivelIndentacion * 12 : 0
  const esSubgrupo = variante === 'subgrupo'

  return (
    <TouchableOpacity
      className={`mb-2 flex-row items-center gap-2 ${esSubgrupo ? '' : 'mb-3'}`}
      style={paddingLeft > 0 ? { paddingLeft } : undefined}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded: expandido }}
      testID={testID}
    >
      <Texto
        variante="eyebrow"
        className={`flex-1 ${esSubgrupo ? 'text-zinc-100' : 'text-base text-zinc-300 normal-case tracking-wide'}`}
      >
        {titulo}
      </Texto>
      <Ionicons name={chevronName} size={16} color="#a1a1aa" />
    </TouchableOpacity>
  )
}
