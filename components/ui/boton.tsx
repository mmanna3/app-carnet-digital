import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'

type Variante = 'Principal' | 'Secundario'

type Props = {
  onPress: () => void
  texto: string
  deshabilitado?: boolean
  cargando?: boolean
  variante?: Variante
  icono?: keyof typeof Feather.glyphMap
  className?: string
  testID?: string
}

const estilosPorVariante: Record<Variante, string> = {
  Principal: 'rounded-full bg-white px-5 py-3',
  Secundario: 'glass rounded-full border border-border-glass px-5 py-3',
}

const estilosTextoPorVariante: Record<Variante, string> = {
  Principal: 'font-display text-xs uppercase tracking-widest text-black',
  Secundario: 'font-display text-xs uppercase tracking-widest text-zinc-200',
}

export function BotonUi({
  onPress,
  texto,
  deshabilitado = false,
  cargando = false,
  variante = 'Principal',
  icono,
  className = '',
  testID,
}: Props) {
  const isDisabled = deshabilitado || cargando
  const base = 'min-h-[48px] flex-row items-center justify-center gap-2'
  const varianteStyles = estilosPorVariante[variante]
  const textoStyles = estilosTextoPorVariante[variante]
  const colorIcono = variante === 'Principal' ? '#000000' : '#e4e4e7'

  return (
    <TouchableOpacity
      testID={testID}
      className={`${base} ${varianteStyles} ${isDisabled ? 'opacity-70' : ''} ${className}`.trim()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {cargando ? (
        <ActivityIndicator color={colorIcono} />
      ) : (
        <>
          {icono && <Feather name={icono} size={18} color={colorIcono} />}
          <Text className={textoStyles} style={{ fontFamily: 'Coalition' }}>
            {texto}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}
