import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { queryKeys } from '@/lib/api/query-keys'
import { useSeleccionJugadores } from '@/lib/hooks/use-seleccion-jugadores'
import { colorAgrupadorEquipo, temaFranjaEquipo } from '@/lib/utilidades/color-carnet'
import type { TemaFranja } from '@/design-system/componentes'

export type ModalActiva = 'acciones' | 'eliminar' | 'transferir' | null
export type ModalBulk = 'eliminar' | 'transferir' | null

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

export function useMisJugadores() {
  const { equipoSeleccionadoId } = useEquipoStore()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<CarnetDigitalDTO | null>(null)
  const [modalActiva, setModalActiva] = useState<ModalActiva>(null)
  const [modalBulk, setModalBulk] = useState<ModalBulk>(null)
  const [refreshing, setRefreshing] = useState(false)

  const { modoSeleccion, jugadoresSeleccionados, toggle, desactivar } = useSeleccionJugadores()

  const {
    data: jugadores,
    isLoading,
    isError,
  } = useApiQuery({
    key: queryKeys.carnets.byEquipo(equipoSeleccionadoId),
    fn: async () => {
      if (!equipoSeleccionadoId) throw new Error('No hay equipo seleccionado')
      return await api.carnets(equipoSeleccionadoId)
    },
    transformarResultado: (resultado) => resultado,
    activado: !!equipoSeleccionadoId && isAuthenticated,
  })

  useEffect(() => {
    desactivar()
  }, [equipoSeleccionadoId, desactivar])

  const handleLongPress = (jugador: CarnetDigitalDTO) => {
    setJugadorSeleccionado(jugador)
    setModalActiva('acciones')
  }

  const cerrarModales = () => {
    setModalActiva(null)
    setJugadorSeleccionado(null)
  }

  const invalidarCarnets = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) })
  }

  const handleEliminado = () => {
    cerrarModales()
    invalidarCarnets()
  }

  const handleTransferido = () => {
    cerrarModales()
    invalidarCarnets()
  }

  const handleEliminadoMasivo = () => {
    setModalBulk(null)
    desactivar()
    invalidarCarnets()
  }

  const handleTransferidoMasivo = () => {
    setModalBulk(null)
    desactivar()
    invalidarCarnets()
  }

  const handleActualizar = async () => {
    if (!equipoSeleccionadoId) return
    setRefreshing(true)
    try {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) }),
        queryClient.refetchQueries({
          queryKey: queryKeys.jugadores.pendientes(equipoSeleccionadoId),
        }),
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const jugadoresLista = jugadores ?? []
  const agrupacion = agruparJugadoresPorCategoria(jugadoresLista)
  const temaTorneo: TemaFranja = temaFranjaEquipo(jugadoresLista)
  const colorAgrupadorDelEquipo = colorAgrupadorEquipo(jugadoresLista)

  const jugadoresParaAccionMasiva = jugadoresLista.filter(
    (j) => jugadoresSeleccionados.includes(j.id!) && j.esDelegado !== true
  )

  return {
    equipoSeleccionadoId,
    isAuthenticated,
    jugadores: jugadoresLista,
    isLoading,
    isError,
    refreshing,
    handleActualizar,
    ...agrupacion,
    temaTorneo,
    colorAgrupadorDelEquipo,
    modoSeleccion,
    jugadoresSeleccionados,
    toggle,
    desactivar,
    handleLongPress,
    jugadorSeleccionado,
    modalActiva,
    setModalActiva,
    modalBulk,
    setModalBulk,
    cerrarModales,
    handleEliminado,
    handleTransferido,
    handleEliminadoMasivo,
    handleTransferidoMasivo,
    jugadoresParaAccionMasiva,
    haySeleccionados: jugadoresParaAccionMasiva.length > 0,
  }
}
