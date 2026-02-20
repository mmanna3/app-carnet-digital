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
}
