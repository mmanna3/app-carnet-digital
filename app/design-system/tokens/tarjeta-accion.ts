const OPACIDAD_COLOR = 0.72
const OPACIDAD_NEGRO = 0.55

export const COLOR_TARJETA = {
  ROJO: 'rojo',
  AZUL: 'azul',
  VERDE: 'verde',
} as const

export type ColorTarjeta = (typeof COLOR_TARJETA)[keyof typeof COLOR_TARJETA]

export const ICONO_DONDE = {
  ARRIBA: 'arriba',
  ALCOSTADO: 'alcostado',
} as const

export type IconoDonde = (typeof ICONO_DONDE)[keyof typeof ICONO_DONDE]

export type TemaTarjetaAccion = {
  borde: string
  degradado: readonly [string, string]
  bordeIcono: string
  fondoIcono: string
  colorIcono: string
}

export const TEMAS_TARJETA_ACCION: Record<ColorTarjeta, TemaTarjetaAccion> = {
  rojo: {
    borde: 'rgba(248, 113, 113, 0.7)',
    degradado: [
      `rgba(220, 38, 38, ${OPACIDAD_COLOR})`,
      `rgba(0, 0, 0, ${OPACIDAD_NEGRO})`,
    ],
    bordeIcono: 'rgba(248, 113, 113, 0.7)',
    fondoIcono: 'rgba(220, 38, 38, 0.2)',
    colorIcono: '#f87171',
  },
  azul: {
    borde: 'rgba(56, 189, 248, 0.7)',
    degradado: [
      `rgba(37, 99, 235, ${OPACIDAD_COLOR})`,
      `rgba(0, 0, 0, ${OPACIDAD_NEGRO})`,
    ],
    bordeIcono: 'rgba(56, 189, 248, 0.7)',
    fondoIcono: 'rgba(37, 99, 235, 0.2)',
    colorIcono: '#38bdf8',
  },
  verde: {
    borde: 'rgba(74, 222, 128, 0.7)',
    degradado: [
      `rgba(22, 163, 74, ${OPACIDAD_COLOR})`,
      `rgba(0, 0, 0, ${OPACIDAD_NEGRO})`,
    ],
    bordeIcono: 'rgba(74, 222, 128, 0.7)',
    fondoIcono: 'rgba(22, 163, 74, 0.2)',
    colorIcono: '#4ade80',
  },
}

/** CTA principal del wizard fichaje (verde sólido/brillante, sin negro en el degradado). */
export const TEMA_BOTON_WIZARD = {
  degradado: ['#4ade80', '#16a34a'] as const,
  borde: 'rgba(134, 239, 172, 0.85)',
}
