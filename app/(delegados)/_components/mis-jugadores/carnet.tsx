import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { CarnetDigitalDTO, CarnetDigitalPendienteDTO } from '@/lib/api/clients'
import { FranjaSeccion } from '@/design-system/componentes'
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '@/lib/types/estado-jugador'

function MiniTarjetaDisciplina({
  cantidad,
  variante,
}: {
  cantidad: number
  variante: 'amarilla' | 'roja'
}) {
  const esAmarilla = variante === 'amarilla'
  return (
    <View
      className={`h-9 min-w-[26px] items-center justify-center rounded px-1 ${
        esAmarilla ? 'border border-amber-600 bg-yellow-400' : 'border border-red-900 bg-red-600'
      }`}
      accessibilityLabel={esAmarilla ? 'Tarjetas amarillas' : 'Tarjetas rojas'}
    >
      <Text
        className={`text-sm font-bold tabular-nums ${esAmarilla ? 'text-gray-900' : 'text-white'}`}
      >
        {cantidad}
      </Text>
    </View>
  )
}

interface CarnetProps {
  jugador: CarnetDigitalDTO | CarnetDigitalPendienteDTO
  mostrarEstado?: boolean
  mostrarMotivo?: boolean
  onLongPress?: () => void
  onPress?: () => void
  seleccionado?: boolean
  modoSeleccion?: boolean
}

export default function Carnet({
  jugador,
  mostrarEstado = false,
  mostrarMotivo = false,
  onLongPress,
  onPress,
  seleccionado = false,
  modoSeleccion = false,
}: CarnetProps) {
  const estado = jugador.estado as EstadoJugador
  const esDelegado = jugador.esDelegado === true
  const debeMostrarEstado =
    mostrarEstado || estado === EstadoJugador.Inhabilitado || estado === EstadoJugador.Suspendido

  const obtenerCategoria = (fechaNacimiento: Date) => {
    const año = new Date(fechaNacimiento).getFullYear().toString()
    return año.slice(-2)
  }

  const ta = jugador.tarjetasAmarillas
  const tr = jugador.tarjetasRojas
  const muestraTarjetasAmarillas = typeof ta === 'number' && ta > 0
  const muestraTarjetasRojas = typeof tr === 'number' && tr > 0

  return (
    <Pressable
      testID={`carnet-jugador-${jugador.id ?? 'unknown'}`}
      accessibilityLabel="carnet-jugador"
      onPress={modoSeleccion ? onPress : undefined}
      onLongPress={modoSeleccion ? undefined : onLongPress}
      delayLongPress={400}
      className={`m-4 overflow-hidden rounded-2xl border ${
        esDelegado ? 'border-4 border-liga-600 glass' : 'border border-border-glass glass'
      }`}
    >
      {modoSeleccion && (
        <View
          className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-full border-2 items-center justify-center ${
            seleccionado ? 'border-green-400 bg-green-500/20' : 'border-border-glass glass'
          }`}
        >
          {seleccionado && (
            <Text className="text-green-400 text-base font-bold leading-none">✓</Text>
          )}
        </View>
      )}
      {debeMostrarEstado && (
        <View style={{ backgroundColor: obtenerColorEstado(estado) }} className="p-3">
          <Text className="text-white text-base font-bold text-center uppercase">
            {obtenerTextoEstado(estado)}
          </Text>
        </View>
      )}
      {esDelegado && (
        <FranjaSeccion className="mb-0 rounded-none border-x-0 border-t-0">DT/Delegado</FranjaSeccion>
      )}
      <View className={`p-4 ${esDelegado ? 'mx-2 mt-2 mb-2 rounded-xl border border-dashed border-liga-600/50' : ''}`}>
        <View className="items-center mb-4 border-b border-border-glass pb-3">
          <Text className="text-2xl font-bold mb-1 text-zinc-100">{jugador.equipo}</Text>
          <Text className="text-lg text-zinc-400">{jugador.torneo}</Text>
        </View>

        <View className="mb-4 items-center">
          {jugador.fotoCarnet || muestraTarjetasAmarillas || muestraTarjetasRojas ? (
            <View className="relative h-40 w-40">
              {jugador.fotoCarnet ? (
                <View className="h-40 w-40 overflow-hidden rounded-lg border border-border-glass">
                  <Image
                    source={{ uri: jugador.fotoCarnet }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                </View>
              ) : null}
              {muestraTarjetasAmarillas ? (
                <View className="absolute left-full ml-3 top-[62px]">
                  <MiniTarjetaDisciplina cantidad={ta} variante="amarilla" />
                </View>
              ) : null}
              {muestraTarjetasRojas ? (
                <View className="absolute left-full ml-3 top-[106px]">
                  <MiniTarjetaDisciplina cantidad={tr} variante="roja" />
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        <View className="bg-surface-elevated rounded-lg p-3 border border-border-glass">
          <View className="flex-row justify-between items-center py-1.5 border-b border-border-glass">
            <Text className="text-base font-semibold text-zinc-400">DNI:</Text>
            <Text className="text-base text-zinc-100">{jugador.dni}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-border-glass">
            <Text className="text-base font-semibold text-zinc-400">Nombre:</Text>
            <Text className="text-base text-zinc-100">{jugador.nombre}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-border-glass">
            <Text className="text-base font-semibold text-zinc-400">Apellido:</Text>
            <Text className="text-base text-zinc-100">{jugador.apellido}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-border-glass">
            <Text className="text-base font-semibold text-zinc-400">Fecha Nac:</Text>
            <Text className="text-base text-zinc-100">
              {new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')}
            </Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5">
            <Text className="text-base font-semibold text-zinc-400">Categoría:</Text>
            <Text className="text-base text-zinc-100">
              Cat {obtenerCategoria(jugador.fechaNacimiento)}
            </Text>
          </View>
        </View>

        {mostrarMotivo && 'motivo' in jugador && jugador.motivo && (
          <View className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
            <Text className="text-base font-bold mb-1 text-red-400">Motivo:</Text>
            <Text className="text-sm text-zinc-400 leading-5">{jugador.motivo}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}
