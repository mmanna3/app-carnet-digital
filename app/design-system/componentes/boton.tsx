import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'

type VarianteUi = 'Principal' | 'Secundario' | 'Destructivo'
type VarianteLegacy = 'Principal' | 'Secundario' | 'Destructivo'

type Props = {
  onPress: () => void
  texto: string
  deshabilitado?: boolean
  cargando?: boolean
  variante?: VarianteUi
  icono?: keyof typeof Feather.glyphMap
  className?: string
  testID?: string
  /** Estilo claro con color de liga (pantallas delegados legacy). */
  tema?: 'oscuro' | 'liga'
}

const estilosOscuro: Record<VarianteUi, string> = {
  Principal: 'rounded-full bg-white px-5 py-3',
  Secundario: 'glass rounded-full border border-border-glass px-5 py-3',
  Destructivo: 'rounded-full bg-red-600 px-5 py-3',
}

const textoOscuro: Record<VarianteUi, string> = {
  Principal: 'font-display text-xs uppercase tracking-widest text-black',
  Secundario: 'font-display text-xs uppercase tracking-widest text-zinc-200',
  Destructivo: 'font-display text-xs uppercase tracking-widest text-white',
}

const estilosLiga: Record<VarianteLegacy, string> = {
  Principal: 'bg-liga-600 shadow-md',
  Destructivo: 'bg-red-600 shadow-md',
  Secundario: 'border-2 border-gray-300 bg-transparent',
}

const textoLiga: Record<VarianteLegacy, string> = {
  Principal: 'text-white',
  Destructivo: 'text-white',
  Secundario: 'text-gray-500',
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
  tema = 'oscuro',
}: Props) {
  const isDisabled = deshabilitado || cargando
  const base =
    tema === 'liga'
      ? 'h-[50px] rounded-xl flex-row items-center justify-center gap-2 px-4 mt-2.5'
      : 'min-h-[48px] flex-row items-center justify-center gap-2'
  const varianteStyles = tema === 'liga' ? estilosLiga[variante] : estilosOscuro[variante]
  const textoStyles = tema === 'liga' ? textoLiga[variante] : textoOscuro[variante]
  const colorIcono =
    tema === 'liga'
      ? variante === 'Secundario'
        ? '#6b7280'
        : '#ffffff'
      : variante === 'Principal'
        ? '#000000'
        : '#e4e4e7'

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
          {icono && <Feather name={icono} size={tema === 'liga' ? 22 : 18} color={colorIcono} />}
          <Text
            className={tema === 'liga' ? `text-base font-semibold ${textoStyles}` : textoStyles}
            style={tema === 'oscuro' ? { fontFamily: 'Coalition' } : undefined}
          >
            {texto}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}

/** Alias default para pantallas que importaban `@/components/boton`. */
export default function Boton(props: Props) {
  return <BotonUi {...props} tema="liga" />
}
