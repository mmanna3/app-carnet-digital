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
      className={`m-4 overflow-hidden rounded-2xl bg-zinc-200 shadow-sm ${
        esDelegado ? 'border-4 border-liga-600' : 'border border-zinc-200'
      }`}
    >
      {modoSeleccion && (
        <View
          className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-full border-2 items-center justify-center ${
            seleccionado ? 'border-green-600 bg-green-100' : 'border-zinc-400 bg-white'
          }`}
        >
          {seleccionado && (
            <Text className="text-green-700 text-base font-bold leading-none">✓</Text>
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
        <FranjaSeccion className="mb-0 rounded-none border-x-0 border-t-0">
          DT/Delegado
        </FranjaSeccion>
      )}
      <View
        className={`p-4 ${esDelegado ? 'mx-2 mt-2 mb-2 rounded-xl border border-dashed border-liga-600/60 bg-liga-50' : ''}`}
      >
        <View className="items-center mb-4 border-b border-zinc-200 pb-3">
          <Text className="text-2xl font-bold mb-1 text-zinc-900">{jugador.equipo}</Text>
          <Text className="text-lg text-zinc-600">{jugador.torneo}</Text>
        </View>

        <View className="mb-4 items-center">
          {jugador.fotoCarnet || muestraTarjetasAmarillas || muestraTarjetasRojas ? (
            <View className="relative h-40 w-40">
              {jugador.fotoCarnet ? (
                <View className="h-40 w-40 overflow-hidden rounded-lg border border-zinc-300">
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

        <View className="rounded-lg border border-zinc-400/80 bg-zinc-300/80 p-3">
          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-400/80">
            <Text className="text-base font-semibold text-zinc-700">DNI:</Text>
            <Text className="text-base font-medium text-zinc-950">{jugador.dni}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-400/80">
            <Text className="text-base font-semibold text-zinc-700">Nombre:</Text>
            <Text className="text-base font-medium text-zinc-950">{jugador.nombre}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-400/80">
            <Text className="text-base font-semibold text-zinc-700">Apellido:</Text>
            <Text className="text-base font-medium text-zinc-950">{jugador.apellido}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-400/80">
            <Text className="text-base font-semibold text-zinc-700">Fecha Nac:</Text>
            <Text className="text-base font-medium text-zinc-950">
              {new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')}
            </Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5">
            <Text className="text-base font-semibold text-zinc-700">Categoría:</Text>
            <Text className="text-base font-medium text-zinc-950">
              Cat {obtenerCategoria(jugador.fechaNacimiento)}
            </Text>
          </View>
        </View>

        {mostrarMotivo && 'motivo' in jugador && jugador.motivo && (
          <View className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <Text className="text-base font-bold mb-1 text-red-800">Motivo:</Text>
            <Text className="text-sm leading-5 text-zinc-700">{jugador.motivo}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}
