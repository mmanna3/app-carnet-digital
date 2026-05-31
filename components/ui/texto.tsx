import React from 'react'
import { Text, type TextProps, type TextStyle } from 'react-native'
import { FUENTE_BRAND, FUENTE_DISPLAY, FUENTE_SANS } from '@/lib/design-system/fuentes'

type Variante = 'display' | 'titulo' | 'cuerpo' | 'eyebrow' | 'caption' | 'brand'

const estilosPorVariante: Record<Variante, string> = {
  display: 'text-zinc-100 uppercase tracking-wide',
  titulo: 'text-zinc-100 text-lg',
  cuerpo: 'text-base text-zinc-300',
  eyebrow: 'text-xs uppercase tracking-widest text-zinc-500',
  caption: 'text-sm text-zinc-500',
  brand: 'text-zinc-100',
}

const fuentePorVariante: Record<Variante, string> = {
  display: FUENTE_DISPLAY,
  titulo: FUENTE_DISPLAY,
  cuerpo: FUENTE_SANS,
  eyebrow: FUENTE_DISPLAY,
  caption: FUENTE_SANS,
  brand: FUENTE_BRAND,
}

type Props = TextProps & {
  variante?: Variante
  className?: string
  children: React.ReactNode
}

/** Si className trae un color de texto, no aplicar el de la variante (evita que gane text-zinc-500, etc.). */
function classNameTieneColorTexto(className: string): boolean {
  return /\btext-(?:white|zinc|gray|slate|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black)(?:-\d+)?\b/.test(
    className
  )
}

export function Texto({ variante = 'cuerpo', className = '', style, children, ...rest }: Props) {
  const fontStyle: TextStyle = { fontFamily: fuentePorVariante[variante] }
  const clasesVariante = classNameTieneColorTexto(className)
    ? estilosPorVariante[variante].replace(/\btext-\S+/g, '').trim()
    : estilosPorVariante[variante]
  return (
    <Text
      className={`${clasesVariante} ${className}`.trim()}
      style={[fontStyle, style]}
      {...rest}
    >
      {children}
    </Text>
  )
}
