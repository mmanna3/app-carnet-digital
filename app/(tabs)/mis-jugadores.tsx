import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { queryKeys } from '@/lib/api/query-keys'
import { useSeleccionJugadores } from '@/lib/hooks/use-seleccion-jugadores'
import Carnet from '../components/carnet'
import Boton from '@/components/boton'
import ModalAccionesJugador from '../components/modal-acciones-jugador'
import ModalEliminarJugador from '../components/modal-eliminar-jugador'
import ModalTransferirJugador from '../components/modal-transferir-jugador'
import ModalEliminarMasivo from '../components/modal-eliminar-masivo'
import ModalTransferirMasivo from '../components/modal-transferir-masivo'

type ModalActiva = 'acciones' | 'eliminar' | 'transferir' | null
type ModalBulk = 'eliminar' | 'transferir' | null

export default function MisJugadoresScreen() {
  const { equipoSeleccionadoId } = useEquipoStore()
  const { isAuthenticated } = useAuth()
  const scrollViewRef = useRef<ScrollView>(null)
  const [categoryPositions, setCategoryPositions] = useState<Record<number, number>>({})
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
  }, [equipoSeleccionadoId])

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
        queryClient.refetchQueries({ queryKey: queryKeys.jugadores.pendientes(equipoSeleccionadoId) }),
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
      <View className="flex-1 bg-[#f8f8f8]">
        <Text className="text-base text-center p-5">Debes seleccionar un equipo primero</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#f8f8f8] items-center justify-center gap-3">
        <ActivityIndicator size="large" color="#6b7280" />
        <Text className="text-base text-gray-600">Cargando jugadores...</Text>
      </View>
    )
  }

  if (isError || !jugadores) {
    return (
      <View className="flex-1 bg-[#f8f8f8] items-center justify-center p-5">
        <Text className="text-base text-center text-gray-600">Error al cargar los jugadores.</Text>
      </View>
    )
  }

  if (jugadores.length === 0) {
    return (
      <ScrollView
        className="flex-1 bg-[#f8f8f8]"
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleActualizar} />
        }
      >
        <Text className="text-base text-center text-gray-600">
          No hay jugadores activos en este equipo.
        </Text>
      </ScrollView>
    )
  }

  const obtenerAñoCompleto = (fechaNacimiento: Date) => {
    return new Date(fechaNacimiento).getFullYear()
  }

  const jugadoresPorCategoria = jugadores.reduce(
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

  const categorias = Object.keys(jugadoresPorCategoria)
    .map(Number)
    .sort((a, b) => a - b)

  const scrollToCategory = (año: number) => {
    const position = categoryPositions[año]
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true })
    }
  }

  const handleCategoryLayout = (año: number, event: any) => {
    const { y } = event.nativeEvent.layout
    setCategoryPositions((prev) => ({
      ...prev,
      [año]: y,
    }))
  }

  const jugadoresParaAccionMasiva = jugadores.filter((j) =>
    jugadoresSeleccionados.includes(j.id!)
  )

  const haySeleccionados = jugadoresSeleccionados.length > 0

  return (
    <View testID="pantalla-mis-jugadores" className="flex-1 bg-[#f8f8f8]">
      <View className="bg-white py-2.5 border-b border-gray-200 z-[1]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {categorias.map((año) => (
            <TouchableOpacity
              key={`button-${año}`}
              className="bg-liga-600 px-5 py-2 rounded-full mx-1.5"
              onPress={() => scrollToCategory(año)}
            >
              <Text className="text-white text-base font-semibold">{año}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleActualizar} />
        }
      >
        <View className="p-2.5">
          {categorias.map((año) => (
            <View key={año} onLayout={(event) => handleCategoryLayout(año, event)}>
              <View className="bg-liga-600 p-3 mb-4 rounded-lg shadow-md">
                <Text className="text-white text-lg font-bold text-center">Categoría {año}</Text>
              </View>
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
        <View className="bg-white border-t border-gray-200 px-4 pt-3 pb-6 gap-2">
          <View className="flex-row gap-3">
            <Boton
              variante="Destructivo"
              icono="trash-2"
              texto="Eliminar"
              onPress={() => setModalBulk('eliminar')}
              deshabilitado={!haySeleccionados}
              className="flex-1 mt-0"
            />
            <Boton
              variante="Principal"
              icono="external-link"
              texto="Transferir"
              onPress={() => setModalBulk('transferir')}
              deshabilitado={!haySeleccionados}
              className="flex-1 mt-0"
            />
          </View>
          <Boton
            variante="Secundario"
            texto="Cancelar"
            onPress={desactivar}
            className="mt-0"
          />
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
