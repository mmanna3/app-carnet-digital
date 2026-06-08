import type { PosicionDelEquipoDTO } from '@/lib/api/clients'
import { textoOGuion } from '@/lib/utilidades/recursos-api'

/** Anchos mínimos por columna (sin líneas verticales entre columnas). */
export const ANCHO_POSICIONES = {
  pos: 40,
  esc: 44,
  num: 34,
  goles: 38,
  pts: 40,
} as const

export function titulosTabla(mostrarGoles: boolean): string[] {
  const t = ['Pos', 'Esc', 'Equipo', 'Pts', 'J', 'G', 'E', 'P', 'Np']
  if (mostrarGoles) t.push('Gf', 'Gc', 'Df')
  return t
}

export function anchoColumna(
  i: number,
  mostrarGoles: boolean,
  numColumnas: number,
  anchoEquipo: number
): number {
  if (i === 0) return ANCHO_POSICIONES.pos
  if (i === 1) return ANCHO_POSICIONES.esc
  if (i === 2) return anchoEquipo
  if (i === 3) return ANCHO_POSICIONES.pts
  if (mostrarGoles && i >= numColumnas - 3 && i <= numColumnas - 1) return ANCHO_POSICIONES.goles
  return ANCHO_POSICIONES.num
}

/** Suma exacta de columnas: evita hueco vacío a la derecha al hacer scroll horizontal. */
export function anchoTablaTotal(mostrarGoles: boolean, anchoEquipo: number): number {
  return (
    ANCHO_POSICIONES.pos +
    ANCHO_POSICIONES.esc +
    anchoEquipo +
    ANCHO_POSICIONES.num * 5 +
    (mostrarGoles ? ANCHO_POSICIONES.goles * 3 : 0) +
    ANCHO_POSICIONES.pts
  )
}

export function valorCeldaPosicion(label: string, r: PosicionDelEquipoDTO): string {
  switch (label) {
    case 'Pos':
      return textoOGuion(r.posicion)
    case 'Equipo':
      return textoOGuion(r.equipo)
    case 'J':
      return textoOGuion(r.partidosJugados)
    case 'G':
      return textoOGuion(r.partidosGanados)
    case 'E':
      return textoOGuion(r.partidosEmpatados)
    case 'P':
      return textoOGuion(r.partidosPerdidos)
    case 'Np':
      return textoOGuion(r.partidosNoPresento)
    case 'Gf':
      return textoOGuion(r.golesAFavor)
    case 'Gc':
      return textoOGuion(r.golesEnContra)
    case 'Df':
      return textoOGuion(r.golesDiferencia)
    case 'Pts':
      return textoOGuion(r.puntos)
    default:
      return '—'
  }
}
