import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import ModalAccionesJugador from '@/delegados/_components/mis-jugadores/modal-acciones-jugador'
import ModalEliminarJugador from '@/delegados/_components/mis-jugadores/modal-eliminar-jugador'
import ModalTransferirJugador from '@/delegados/_components/mis-jugadores/modal-transferir-jugador'
import ModalEliminarMasivo from '@/delegados/_components/mis-jugadores/modal-eliminar-masivo'
import ModalTransferirMasivo from '@/delegados/_components/mis-jugadores/modal-transferir-masivo'
import {
  agruparJugadoresPorCategoria,
  jugadoresSeleccionadosParaAccionMasiva,
} from '@/inicio-delegados/_components/mis-jugadores/agrupar-jugadores'
import BarraSeleccionMasiva from '@/inicio-delegados/_components/mis-jugadores/barra-seleccion-masiva'
import ListaCarnetsEquipo from '@/inicio-delegados/_components/mis-jugadores/lista-carnets-equipo'
import SelectorCategorias from '@/inicio-delegados/_components/mis-jugadores/selector-categorias'
import { useCarnetsEquipo } from '@/inicio-delegados/_components/mis-jugadores/use-carnets-equipo'
import { useModalesMisJugadores } from '@/inicio-delegados/_components/mis-jugadores/use-modales-mis-jugadores'
import { useSeleccionJugadores } from '@/lib/hooks/use-seleccion-jugadores'
import { colorAgrupadorEquipo, temaFranjaEquipo } from '@/lib/utilidades/color-carnet'

export default function MisJugadoresScreen() {
  const scrollViewRef = useRef<ScrollView>(null)
  const [categoryPositions, setCategoryPositions] = useState<Record<number | string, number>>({})

  const {
    equipoSeleccionadoId,
    isAuthenticated,
    jugadores,
    isLoading,
    isError,
    refreshing,
    handleActualizar,
    invalidarCarnets,
  } = useCarnetsEquipo()

  const { modoSeleccion, jugadoresSeleccionados, toggle, desactivar } = useSeleccionJugadores()

  const modales = useModalesMisJugadores({
    invalidarCarnets,
    desactivarSeleccion: desactivar,
  })

  useEffect(() => {
    desactivar()
  }, [equipoSeleccionadoId, desactivar])

  const { delegados, hayDelegados, categoriasAño, jugadoresPorCategoria, secciones } = useMemo(
    () => agruparJugadoresPorCategoria(jugadores),
    [jugadores]
  )
  const temaTorneo = useMemo(() => temaFranjaEquipo(jugadores), [jugadores])
  const colorAgrupadorDelEquipo = useMemo(() => colorAgrupadorEquipo(jugadores), [jugadores])
  const jugadoresParaAccionMasiva = useMemo(
    () => jugadoresSeleccionadosParaAccionMasiva(jugadores, jugadoresSeleccionados),
    [jugadores, jugadoresSeleccionados]
  )

  const scrollToSection = (seccion: number | string) => {
    const position = categoryPositions[seccion]
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true })
    }
  }

  const handleSectionLayout = (
    seccion: number | string,
    event: { nativeEvent: { layout: { y: number } } }
  ) => {
    const { y } = event.nativeEvent.layout
    setCategoryPositions((prev) => ({
      ...prev,
      [seccion]: y,
    }))
  }

  if (!isAuthenticated) {
    return null
  }

  if (!equipoSeleccionadoId) {
    return (
      <View className="flex-1 bg-surface">
        <Text className="text-base text-center p-5 text-zinc-400">
          Debes seleccionar un equipo primero
        </Text>
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

  return (
    <View testID="pantalla-mis-jugadores" className="flex-1 bg-surface">
      <View className="bg-surface-elevated py-2.5 border-b border-border-glass z-[1]">
        <SelectorCategorias
          secciones={secciones}
          temaTorneo={temaTorneo}
          onSeleccionar={scrollToSection}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleActualizar} />}
      >
        <ListaCarnetsEquipo
          delegados={delegados}
          hayDelegados={hayDelegados}
          categoriasAño={categoriasAño}
          jugadoresPorCategoria={jugadoresPorCategoria}
          temaTorneo={temaTorneo}
          colorAgrupadorDelEquipo={colorAgrupadorDelEquipo}
          modoSeleccion={modoSeleccion}
          jugadoresSeleccionados={jugadoresSeleccionados}
          onSectionLayout={handleSectionLayout}
          onLongPress={modales.handleLongPress}
          onToggle={toggle}
        />
      </ScrollView>

      {modoSeleccion && (
        <BarraSeleccionMasiva
          haySeleccionados={jugadoresParaAccionMasiva.length > 0}
          onEliminar={() => modales.setModalBulk('eliminar')}
          onTransferir={() => modales.setModalBulk('transferir')}
          onCancelar={desactivar}
        />
      )}

      <ModalAccionesJugador
        jugador={modales.modalActiva === 'acciones' ? modales.jugadorSeleccionado : null}
        onEliminar={() => modales.setModalActiva('eliminar')}
        onTransferir={() => modales.setModalActiva('transferir')}
        onCerrar={modales.cerrarModales}
      />

      <ModalEliminarJugador
        jugador={modales.modalActiva === 'eliminar' ? modales.jugadorSeleccionado : null}
        equipoId={equipoSeleccionadoId}
        onEliminado={modales.handleEliminado}
        onCerrar={modales.cerrarModales}
      />

      <ModalTransferirJugador
        jugador={modales.modalActiva === 'transferir' ? modales.jugadorSeleccionado : null}
        onTransferido={modales.handleTransferido}
        onCerrar={modales.cerrarModales}
      />

      <ModalEliminarMasivo
        jugadores={modales.modalBulk === 'eliminar' ? jugadoresParaAccionMasiva : null}
        equipoId={equipoSeleccionadoId}
        onEliminado={modales.handleEliminadoMasivo}
        onCerrar={() => modales.setModalBulk(null)}
      />

      <ModalTransferirMasivo
        jugadores={modales.modalBulk === 'transferir' ? jugadoresParaAccionMasiva : null}
        onTransferido={modales.handleTransferidoMasivo}
        onCerrar={() => modales.setModalBulk(null)}
      />
    </View>
  )
}
