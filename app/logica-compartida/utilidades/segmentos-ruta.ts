const GRUPOS_OCULTOS = ['(home)', '(fichaje-jugador)', '(delegados)', '(torneos)', '(inicio)'] as const

/** Segmentos visibles en la URL (sin route groups). */
export function segmentosVisibles(segments: readonly string[]): string[] {
  return segments.filter((s) => !GRUPOS_OCULTOS.includes(s as (typeof GRUPOS_OCULTOS)[number]))
}

export function enGrupo(segments: readonly string[], grupo: string): boolean {
  return segments.includes(grupo)
}

export function tieneSegmento(segments: readonly string[], nombre: string): boolean {
  return segmentosVisibles(segments).includes(nombre)
}
