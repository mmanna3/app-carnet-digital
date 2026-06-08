import { CarnetDigitalDTO } from '@/lib/api/clients'

function obtenerAñoCompleto(fechaNacimiento: Date) {
  return new Date(fechaNacimiento).getFullYear()
}

export function agruparJugadoresPorCategoria(jugadores: CarnetDigitalDTO[]) {
  const delegados = jugadores.filter((j) => j.esDelegado === true)
  const jugadoresNoDelegados = jugadores.filter((j) => j.esDelegado !== true)

  const jugadoresPorCategoria = jugadoresNoDelegados.reduce(
    (acc, jugador) => {
      const año = obtenerAñoCompleto(jugador.fechaNacimiento)
      if (!acc[año]) {
        acc[año] = []
      }
      acc[año].push(jugador)
      return acc
    },
    {} as Record<number, CarnetDigitalDTO[]>
  )

  const categoriasAño = Object.keys(jugadoresPorCategoria)
    .map(Number)
    .sort((a, b) => a - b)

  const hayDelegados = delegados.length > 0
  const secciones: (number | 'delegados')[] = hayDelegados
    ? ['delegados', ...categoriasAño]
    : categoriasAño

  return { delegados, jugadoresPorCategoria, categoriasAño, hayDelegados, secciones }
}

export function jugadoresSeleccionadosParaAccionMasiva(
  jugadores: CarnetDigitalDTO[],
  idsSeleccionados: number[]
) {
  return jugadores.filter((j) => idsSeleccionados.includes(j.id!) && j.esDelegado !== true)
}
