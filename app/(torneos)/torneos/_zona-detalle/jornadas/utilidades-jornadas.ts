import type { FechasParaJornadasDTO } from '@/lib/api/clients'
import { anchoColumnaPorTexto } from '@/torneos/_zona-detalle/anchos-tabla'
import { textoOGuion } from '@/lib/utilidades/recursos-api'

function fechaTieneResultados(fecha: FechasParaJornadasDTO): boolean {
  for (const j of fecha.jornadas ?? []) {
    const cats = categoriasResultadoUnico(j.local?.categorias, j.visitante?.categorias)
    for (const c of cats) {
      if ((c.resultado ?? '').trim().length > 0) return true
    }
  }
  return false
}

/** Índice de la última fecha con al menos un resultado cargado; si ninguna, la primera. */
export function indiceUltimaFechaConResultados(fechas: FechasParaJornadasDTO[]): number {
  if (fechas.length === 0) return 0
  for (let i = fechas.length - 1; i >= 0; i--) {
    if (fechaTieneResultados(fechas[i])) return i
  }
  return 0
}

/** El API repite la misma lista en local y visitante; `resultado` sigue `FormatearResultadoPartido` (ej. "2 - 1 (3 - 4)"). */
export function categoriasResultadoUnico(
  loc: { categoria?: string; resultado?: string }[] | undefined,
  vis: { categoria?: string; resultado?: string }[] | undefined
) {
  const a = loc?.length ? loc : vis
  return a ?? []
}

type MarcadorParseado =
  | { ok: true; local: string; visitante: string }
  | { ok: false; texto: string }

/** Separa el marcador combinado en goles local / visitante (y penales si vienen en paréntesis). */
export function parseMarcadorPartido(s: string | undefined): MarcadorParseado {
  const t = (s ?? '').trim()
  if (!t) return { ok: false, texto: '—' }
  const main = t.match(/^(\S+)\s*-\s*(\S+)/)
  if (!main) return { ok: false, texto: t }
  let local = main[1]
  let visitante = main[2]
  const rest = t.slice(main[0].length).trim()
  const pen = rest.match(/^\((\S+)\s*-\s*(\S+)\)\s*$/)
  if (pen) {
    local = `${local} (${pen[1]})`
    visitante = `${visitante} (${pen[2]})`
  }
  return { ok: true, local, visitante }
}

/** Nombres de categoría en orden de aparición (unión de todos los partidos de la fecha). */
export function nombresCategoriasDeFecha(fecha: FechasParaJornadasDTO): string[] {
  const seen = new Set<string>()
  const ordered: string[] = []
  for (const j of fecha.jornadas ?? []) {
    for (const row of categoriasResultadoUnico(j.local?.categorias, j.visitante?.categorias)) {
      const n = (row.categoria ?? '').trim()
      if (!n || seen.has(n)) continue
      seen.add(n)
      ordered.push(n)
    }
  }
  return ordered
}

export function celdaResultadoCategoria(
  categorias: { categoria?: string; resultado?: string }[] | undefined,
  nombreCategoria: string,
  lado: 'local' | 'visitante'
): string {
  const row = (categorias ?? []).find((r) => (r.categoria ?? '').trim() === nombreCategoria)
  if (!row) return '—'
  const mar = parseMarcadorPartido(row.resultado)
  if (mar.ok) return lado === 'local' ? mar.local : mar.visitante
  if (mar.texto !== '—') return lado === 'local' ? mar.texto : '—'
  return '—'
}

/** Ancho por header: el título manda (contenido ≤ 2 caracteres). Misma lógica para P.T. / P.J. */
export const ANCHO_JORNADAS = {
  esc: 44,
  pt: anchoColumnaPorTexto('P.T.'),
  pj: anchoColumnaPorTexto('P.J.'),
} as const

export function anchosColumnasCategorias(nombres: string[]): number[] {
  return nombres.map(anchoColumnaPorTexto)
}

export function anchoTablaJornadas(nombresCategorias: string[], anchoEquipo: number): number {
  const cats = anchosColumnasCategorias(nombresCategorias)
  return (
    ANCHO_JORNADAS.esc +
    anchoEquipo +
    cats.reduce((a, b) => a + b, 0) +
    ANCHO_JORNADAS.pt +
    ANCHO_JORNADAS.pj
  )
}

export function numeroDeTituloFecha(titulo: string | undefined): string {
  const t = (titulo ?? '').trim()
  const sinPrefijo = t.replace(/^Fecha\s+/i, '').trim()
  return sinPrefijo.length > 0 ? sinPrefijo : textoOGuion(titulo)
}

/** Mismo diámetro para seleccionada y no seleccionada → círculo, no óvalo. */
export const DIAMETRO_PILL_JORNADA = 48
export const MARGEN_HORIZONTAL_PILL = 6
export const PADDING_HORIZONTAL_SELECTOR = 10
