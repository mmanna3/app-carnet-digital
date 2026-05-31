/** Tema visual por color de agrupador (API: Verde, Rojo, Azul, etc.) — alineado con liga-web-publica */

export type TemaAgrupador = {
  raw: string
  border: string
  accent: string
  iconColor: string
  iconBg: string
  chipActive: string
  chipActiveBg: string
}

const COLOR_MAP: Record<string, Omit<TemaAgrupador, 'raw'>> = {
  verde: {
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400',
    iconColor: '#34d399',
    iconBg: 'bg-emerald-500/10',
    chipActive: 'text-emerald-400',
    chipActiveBg: 'bg-emerald-500/12',
  },
  rojo: {
    border: 'border-red-500/30',
    accent: 'text-red-400',
    iconColor: '#f87171',
    iconBg: 'bg-red-500/10',
    chipActive: 'text-red-400',
    chipActiveBg: 'bg-red-500/12',
  },
  azul: {
    border: 'border-sky-500/30',
    accent: 'text-sky-400',
    iconColor: '#38bdf8',
    iconBg: 'bg-sky-500/10',
    chipActive: 'text-sky-400',
    chipActiveBg: 'bg-sky-500/12',
  },
  amarillo: {
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    iconColor: '#fbbf24',
    iconBg: 'bg-amber-500/10',
    chipActive: 'text-amber-400',
    chipActiveBg: 'bg-amber-500/12',
  },
  naranja: {
    border: 'border-orange-500/30',
    accent: 'text-orange-400',
    iconColor: '#fb923c',
    iconBg: 'bg-orange-500/10',
    chipActive: 'text-orange-400',
    chipActiveBg: 'bg-orange-500/12',
  },
}

const DEFAULT_THEME: Omit<TemaAgrupador, 'raw'> = {
  border: 'border-white/20',
  accent: 'text-zinc-200',
  iconColor: '#e4e4e7',
  iconBg: 'bg-white/10',
  chipActive: 'text-zinc-200',
  chipActiveBg: 'bg-white/10',
}

export function getTemaAgrupador(colorName: string | undefined): TemaAgrupador {
  const key = (colorName ?? '').trim().toLowerCase()
  const theme = COLOR_MAP[key] ?? DEFAULT_THEME
  return { ...theme, raw: colorName ?? '' }
}

/** Compat: hex para iconos cuando solo hay className */
export function hexIconoAgrupador(colorName: string | undefined): string {
  return getTemaAgrupador(colorName).iconColor
}
