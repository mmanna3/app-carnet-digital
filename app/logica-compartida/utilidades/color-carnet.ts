import { getConfigLiga, getColorLiga600, hexCabeceraPorColorAgrupadorApi } from '@/lib/config/liga'
import { getTemaAgrupador } from '@/design-system/tokens/tema-agrupador'
import { COLOR_TARJETA, type ColorTarjeta } from '@/design-system/tokens/tarjeta-accion'

type JugadorConColor = { color?: string | undefined; esDelegado?: boolean }

export type TemaFranjaCarnet = ColorTarjeta | 'ambar'

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
