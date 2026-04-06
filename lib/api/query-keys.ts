export const queryKeys = {
  equipos: {
    all: ['equipos'] as const,
  },
  carnets: {
    all: ['carnets'] as const,
    byEquipo: (id: number | null | undefined) => ['carnets', id] as const,
  },
  jugadores: {
    pendientes: (id: number | null | undefined) => ['jugadores', 'pendientes', id] as const,
  },
  torneos: {
    infoInicial: (leagueId: string | undefined) => ['torneos', 'infoInicial', leagueId] as const,
  },
  zonas: {
    clubes: (zonaId: number | null | undefined) => ['zonas', 'clubes', zonaId] as const,
    fixture: (zonaId: number | null | undefined) => ['zonas', 'fixture', zonaId] as const,
    jornadas: (zonaId: number | null | undefined) => ['zonas', 'jornadas', zonaId] as const,
    posiciones: (zonaId: number | null | undefined) => ['zonas', 'posiciones', zonaId] as const,
  },
}
