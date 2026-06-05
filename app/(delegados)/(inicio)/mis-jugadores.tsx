import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { queryKeys } from '@/lib/api/query-keys'
import { useSeleccionJugadores } from '@/lib/hooks/use-seleccion-jugadores'
import Carnet from '@/delegados/_components/mis-jugadores/carnet'
import Boton from '@/design-system/componentes/boton'
import { FranjaSeccion } from '@/design-system/componentes'
import ModalAccionesJugador from '@/delegados/_components/mis-jugadores/modal-acciones-jugador'
import ModalEliminarJugador from '@/delegados/_components/mis-jugadores/modal-eliminar-jugador'
import ModalTransferirJugador from '@/delegados/_components/mis-jugadores/modal-transferir-jugador'
import ModalEliminarMasivo from '@/delegados/_components/mis-jugadores/modal-eliminar-masivo'
import ModalTransferirMasivo from '@/delegados/_components/mis-jugadores/modal-transferir-masivo'
import { temaFranjaCarnet } from '@/lib/utilidades/color-carnet'

type ModalActiva = 'acciones' | 'eliminar' | 'transferir' | null
type ModalBulk = 'eliminar' | 'transferir' | null

export default function MisJugadoresScreen() {
  const { equipoSeleccionadoId } = useEquipoStore()
  const { isAuthenticated } = useAuth()
  const scrollViewRef = useRef<ScrollView>(null)
  const [categoryPositions, setCategoryPositions] = useState<Record<number | string, number>>({})
  const queryClient = useQueryClient()

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<CarnetDigitalDTO | null>(null)
  const [modalActiva, setModalActiva] = useState<ModalActiva>(null)
  const [modalBulk, setModalBulk] = useState<ModalBulk>(null)

  const { modoSeleccion, jugadoresSeleccionados, toggle, desactivar } = useSeleccionJugadores()

  const [refreshing, setRefreshing] = useState(false)

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

  const handleEliminado = () => {
    cerrarModales()
    queryClient.invalidateQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) })
  }

  const handleTransferido = () => {
    cerrarModales()
    queryClient.invalidateQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) })
  }

  const handleEliminadoMasivo = () => {
    setModalBulk(null)
    desactivar()
    queryClient.invalidateQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) })
  }

  const handleTransferidoMasivo = () => {
    setModalBulk(null)
    desactivar()
    queryClient.invalidateQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) })
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

  if (!isAuthenticated) {
    return null
  }

  if (!equipoSeleccionadoId) {
    return (
      <View className="flex-1 bg-surface">
        <Text className="text-base text-center p-5 text-zinc-400">Debes seleccionar un equipo primero</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center gap-3">
        <ActivityIndicator size="large" color="#a1a1aa" />
        <Text className="text-base text-zinc-400">Cargando jugadores...</Text>
      </View>
    )
  }

  if (isError || !jugadores) {
    return (
      <View className="flex-1 bg-surface items-center justify-center p-5">
        <Text className="text-base text-center text-zinc-400">Error al cargar los jugadores.</Text>
      </View>
    )
  }

  if (jugadores.length === 0) {
    return (
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleActualizar} />}
      >
        <Text className="text-base text-center text-zinc-400">
          No hay jugadores activos en este equipo.
        </Text>
      </ScrollView>
    )
  }

  const obtenerAñoCompleto = (fechaNacimiento: Date) => {
    return new Date(fechaNacimiento).getFullYear()
  }

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
  const secciones = hayDelegados ? ['delegados' as const, ...categoriasAño] : categoriasAño
  const temaTorneo = temaFranjaCarnet(jugadores[0])

  const scrollToSection = (seccion: number | string) => {
    const position = categoryPositions[seccion]
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true })
    }
  }

  const handleSectionLayout = (seccion: number | string, event: any) => {
    const { y } = event.nativeEvent.layout
    setCategoryPositions((prev) => ({
      ...prev,
      [seccion]: y,
    }))
  }

  const jugadoresParaAccionMasiva = jugadores.filter(
    (j) => jugadoresSeleccionados.includes(j.id!) && j.esDelegado !== true
  )

  const haySeleccionados = jugadoresParaAccionMasiva.length > 0

  return (
    <View testID="pantalla-mis-jugadores" className="flex-1 bg-surface">
      <View className="bg-surface-elevated py-2.5 border-b border-border-glass z-[1]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {secciones.map((seccion) => (
            <FranjaSeccion
              key={`button-${seccion}`}
              variante="pill"
              tema={temaTorneo}
              className="mx-1.5 mb-0"
              onPress={() => scrollToSection(seccion)}
            >
              {seccion === 'delegados' ? 'DT/Delegado' : String(seccion)}
            </FranjaSeccion>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleActualizar} />}
      >
        <View className="p-2.5">
          {hayDelegados && (
            <View key="delegados" onLayout={(event) => handleSectionLayout('delegados', event)}>
              <FranjaSeccion variante="separador" tema={temaTorneo}>
                DT/Delegado
              </FranjaSeccion>
              {delegados.map((jugador) => (
                <Carnet
                  key={jugador.id}
                  jugador={jugador}
                  modoSeleccion={modoSeleccion}
                  seleccionado={false}
                  onPress={undefined}
                  onLongPress={undefined}
                />
              ))}
            </View>
          )}
          {categoriasAño.map((año) => (
            <View key={año} onLayout={(event) => handleSectionLayout(año, event)}>
              <FranjaSeccion variante="separador" tema={temaTorneo}>
                Categoría {año}
              </FranjaSeccion>
              {jugadoresPorCategoria[año].map((jugador) => (
                <Carnet
                  key={jugador.id}
                  jugador={jugador}
                  modoSeleccion={modoSeleccion}
                  seleccionado={jugadoresSeleccionados.includes(jugador.id!)}
                  onPress={modoSeleccion ? () => toggle(jugador.id!) : undefined}
                  onLongPress={modoSeleccion ? undefined : () => handleLongPress(jugador)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {modoSeleccion && (
        <View className="bg-surface-elevated border-t border-border-glass px-4 pt-3 pb-6 gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Boton
                testID="boton-bulk-eliminar"
                texto="Eliminar"
                icono="trash-2"
                color="rojo"
                onPress={() => setModalBulk('eliminar')}
                deshabilitado={!haySeleccionados}
              />
            </View>
            <View className="flex-1">
              <Boton
                texto="Transferir"
                icono="external-link"
                onPress={() => setModalBulk('transferir')}
                deshabilitado={!haySeleccionados}
              />
            </View>
          </View>
          <Boton texto="Cancelar" primario={false} onPress={desactivar} />
        </View>
      )}

      <ModalAccionesJugador
        jugador={modalActiva === 'acciones' ? jugadorSeleccionado : null}
        onEliminar={() => setModalActiva('eliminar')}
        onTransferir={() => setModalActiva('transferir')}
        onCerrar={cerrarModales}
      />

      <ModalEliminarJugador
        jugador={modalActiva === 'eliminar' ? jugadorSeleccionado : null}
        equipoId={equipoSeleccionadoId}
        onEliminado={handleEliminado}
        onCerrar={cerrarModales}
      />

      <ModalTransferirJugador
        jugador={modalActiva === 'transferir' ? jugadorSeleccionado : null}
        onTransferido={handleTransferido}
        onCerrar={cerrarModales}
      />

      <ModalEliminarMasivo
        jugadores={modalBulk === 'eliminar' ? jugadoresParaAccionMasiva : null}
        equipoId={equipoSeleccionadoId}
        onEliminado={handleEliminadoMasivo}
        onCerrar={() => setModalBulk(null)}
      />

      <ModalTransferirMasivo
        jugadores={modalBulk === 'transferir' ? jugadoresParaAccionMasiva : null}
        onTransferido={handleTransferidoMasivo}
        onCerrar={() => setModalBulk(null)}
      />
    </View>
  )
}
