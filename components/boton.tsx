import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'

type Variante = 'Principal' | 'Destructivo' | 'Secundario'

interface BotonProps {
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
  Principal: 'bg-liga-600 shadow-md',
  Destructivo: 'bg-red-600 shadow-md',
  Secundario: 'border-2 border-gray-300 bg-transparent',
}

const estilosTextoPorVariante: Record<Variante, string> = {
  Principal: 'text-white',
  Destructivo: 'text-white',
  Secundario: 'text-gray-500',
}

const colorIconoPorVariante: Record<Variante, string> = {
  Principal: '#ffffff',
  Destructivo: '#ffffff',
  Secundario: '#6b7280',
}

export default function Boton({
  onPress,
  texto,
  deshabilitado = false,
  cargando = false,
  variante = 'Principal',
  icono,
  className = '',
  testID,
}: BotonProps) {
  const isDisabled = deshabilitado || cargando
  const base = 'h-[50px] rounded-xl flex-row items-center justify-center gap-2 px-4 mt-2.5'
  const varianteStyles = estilosPorVariante[variante]
  const textoStyles = estilosTextoPorVariante[variante]
  const colorIcono = colorIconoPorVariante[variante]

  return (
    <TouchableOpacity
      testID={testID}
      className={`${base} ${varianteStyles} ${isDisabled ? 'opacity-70' : ''} ${className}`.trim()}
      onPress={onPress}
      disabled={isDisabled}
    >
      {cargando ? (
        <ActivityIndicator color={variante === 'Secundario' ? '#6b7280' : '#fff'} />
      ) : (
        <>
          {icono && <Feather name={icono} size={22} color={colorIcono} />}
          <Text className={`text-base font-semibold ${textoStyles}`}>{texto}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}
