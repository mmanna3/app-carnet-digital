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

/** Con `tabular-nums` todos los dígitos miden lo mismo en `text-base`. */
const ANCHO_DIGITO = 9.5
/** Padding horizontal de celdas numéricas (px-1.5) + margen de seguridad. */
const PADDING_CELDA_NUMERICA = 14

function anchoMinimoColumna(label: string, anchoEquipo: number): number {
  switch (label) {
    case 'Pos':
      return ANCHO_POSICIONES.pos
    case 'Esc':
      return ANCHO_POSICIONES.esc
    case 'Equipo':
      return anchoEquipo
    case 'Pts':
      return ANCHO_POSICIONES.pts
    case 'Gf':
    case 'Gc':
    case 'Df':
      return ANCHO_POSICIONES.goles
    default:
      return ANCHO_POSICIONES.num
  }
}

/** Ancho por columna: el mínimo fijo, o más si algún valor tiene más caracteres (p. ej. 100+ puntos). */
export function anchosColumnasPosiciones(
  renglones: PosicionDelEquipoDTO[],
  mostrarGoles: boolean,
  anchoEquipo: number
): number[] {
  return titulosTabla(mostrarGoles).map((label) => {
    const minimo = anchoMinimoColumna(label, anchoEquipo)
    if (label === 'Esc' || label === 'Equipo') return minimo
    const maxChars = Math.max(0, ...renglones.map((r) => valorCeldaPosicion(label, r).length))
    return Math.max(minimo, Math.ceil(maxChars * ANCHO_DIGITO + PADDING_CELDA_NUMERICA))
  })
}

/** Suma exacta de columnas: evita hueco vacío a la derecha al hacer scroll horizontal. */
export function anchoTablaTotal(anchos: number[]): number {
  return anchos.reduce((a, b) => a + b, 0)
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
