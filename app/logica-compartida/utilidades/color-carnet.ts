import { getConfigLiga, getColorLiga600, hexCabeceraPorColorAgrupadorApi } from '@/lib/config/liga'
import { getTemaAgrupador } from '@/design-system/tokens/tema-agrupador'
import { COLOR_TARJETA, type ColorTarjeta } from '@/design-system/tokens/tarjeta-accion'

type JugadorConColor = { color?: string | undefined; esDelegado?: boolean }

export type TemaFranjaCarnet = ColorTarjeta | 'ambar'

export type TemaDegradadoEquipo = {
  degradado: readonly [string, string]
  borde: string
}

export function hexConOpacidad(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function oscurecerHex(hex: string, factor: number): string {
  const h = hex.replace('#', '')
  const r = Math.min(255, Math.round(parseInt(h.slice(0, 2), 16) * factor))
  const g = Math.min(255, Math.round(parseInt(h.slice(2, 4), 16) * factor))
  const b = Math.min(255, Math.round(parseInt(h.slice(4, 6), 16) * factor))
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

/** Mismo degradado que la pill de categoría en el carnet del jugador. */
export function temaPillEquipo(hexLink: string): TemaDegradadoEquipo {
  const fondoOscuro = oscurecerHex(hexLink, 0.72)
  return {
    degradado: [hexLink, fondoOscuro],
    borde: hexConOpacidad(fondoOscuro, 0.85),
  }
}

const COLOR_A_TEMA_FRANJA: Record<string, TemaFranjaCarnet> = {
  verde: COLOR_TARJETA.VERDE,
  rojo: COLOR_TARJETA.ROJO,
  azul: COLOR_TARJETA.AZUL,
  amarillo: 'ambar',
  naranja: 'ambar',
}

/** Color del agrupador del API, o color de liga si no hay (p. ej. delegados). */
export function colorAgrupadorParaCarnet(jugador: JugadorConColor): string {
  const delApi = (jugador.color ?? '').trim()
  if (delApi) return delApi

  const colorBase = getConfigLiga()?.colorBase
  if (colorBase && colorBase !== 'negro') return colorBase
  return 'verde'
}

export function coloresDetalleCarnet(jugador: JugadorConColor) {
  const color = colorAgrupadorParaCarnet(jugador)
  const tema = getTemaAgrupador(color)
  return {
    color,
    tema,
    hexAccent: hexCabeceraPorColorAgrupadorApi(color),
    hexIcono: tema.iconColor,
    hexLink: tema.linkOnLight,
  }
}

/** Franja superior y decoración: prioriza agrupador; delegados sin torneo usan liga. */
export function hexFranjaCarnet(jugador: JugadorConColor): string {
  const delApi = (jugador.color ?? '').trim()
  if (delApi) return hexCabeceraPorColorAgrupadorApi(delApi)
  return getColorLiga600()
}

/** Tema de FranjaSeccion (pills y separadores) según color del torneo. */
export function temaFranjaCarnet(jugador: JugadorConColor): TemaFranjaCarnet {
  const color = colorAgrupadorParaCarnet(jugador).toLowerCase()
  return COLOR_A_TEMA_FRANJA[color] ?? COLOR_TARJETA.VERDE
}

function temaFranjaPorDefecto(): TemaFranjaCarnet {
  const colorBase = getConfigLiga()?.colorBase ?? 'verde'
  return COLOR_A_TEMA_FRANJA[colorBase] ?? COLOR_TARJETA.VERDE
}

/** Jugador de referencia para el acento del equipo (prioriza quien trae color del API). */
export function jugadorReferenciaColorEquipo(
  jugadores: JugadorConColor[]
): JugadorConColor | undefined {
  if (jugadores.length === 0) return undefined
  return (
    jugadores.find((j) => (j.color ?? '').trim() !== '') ??
    jugadores.find((j) => j.esDelegado !== true) ??
    jugadores[0]
  )
}

/** Tema de acento para UI del equipo (slider, tabs, franjas). */
export function temaFranjaEquipo(jugadores: JugadorConColor[]): TemaFranjaCarnet {
  const ref = jugadorReferenciaColorEquipo(jugadores)
  if (!ref) return temaFranjaPorDefecto()
  return temaFranjaCarnet(ref)
}

/** Hex de acento para tabs e íconos activos del equipo seleccionado. */
export function hexAcentoEquipo(jugadores: JugadorConColor[]): string {
  const ref = jugadorReferenciaColorEquipo(jugadores)
  if (!ref) return getColorLiga600()
  return hexFranjaCarnet(ref)
}

/** Hex de la pill de categoría / iconos del carnet para el equipo seleccionado. */
export function hexLinkEquipo(jugadores: JugadorConColor[]): string {
  const ref = jugadorReferenciaColorEquipo(jugadores)
  return coloresDetalleCarnet(ref ?? {}).hexLink
}

/** Nombre de agrupador del equipo (p. ej. "azul" para FUTSAL). */
export function colorAgrupadorEquipo(jugadores: JugadorConColor[]): string {
  const ref = jugadorReferenciaColorEquipo(jugadores)
  return colorAgrupadorParaCarnet(ref ?? {})
}

/** Usa el color del jugador o, si falta, el agrupador del equipo (p. ej. delegados). */
export function jugadorParaColoresCarnet(
  jugador: JugadorConColor,
  colorAgrupadorEquipo?: string
): JugadorConColor {
  if ((jugador.color ?? '').trim()) return jugador
  if (colorAgrupadorEquipo) return { ...jugador, color: colorAgrupadorEquipo }
  return jugador
}
