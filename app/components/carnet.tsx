import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { CarnetDigitalDTO, CarnetDigitalPendienteDTO } from '@/lib/api/clients'
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '@/lib/types/estado-jugador'

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

  return (
    <Pressable
      testID="carnet-jugador"
      onPress={modoSeleccion ? onPress : undefined}
      onLongPress={modoSeleccion ? undefined : onLongPress}
      delayLongPress={400}
      className={`m-4 overflow-hidden rounded-2xl shadow-lg elevation-5 ${
        esDelegado
          ? 'border-4 border-liga-700 bg-liga-100'
          : 'border-2 border-gray-200 bg-white'
      }`}
    >
      {modoSeleccion && (
        <View className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full border-2 border-liga-600 bg-white/80 items-center justify-center">
          {seleccionado && (
            <Text className="text-liga-600 text-base font-bold leading-none">✓</Text>
          )}
        </View>
      )}
      {debeMostrarEstado && (
        <View
          style={{ backgroundColor: obtenerColorEstado(estado) }}
          className="p-3 border-b-2 border-gray-200"
        >
          <Text className="text-white text-base font-bold text-center uppercase">
            {obtenerTextoEstado(estado)}
          </Text>
        </View>
      )}
      {esDelegado && (
        <View className="bg-liga-600 py-2 px-4 border-y-2 border-liga-700">
          <Text className="text-white text-center font-bold text-sm uppercase tracking-wider">
            DT/Delegado
          </Text>
        </View>
      )}
      <View className={`p-4 ${esDelegado ? 'bg-white mx-2 mt-2 mb-2 rounded-xl border-2 border-dashed border-liga-300' : ''}`}>
        <View className="items-center mb-4 border-b border-gray-200 pb-3">
          <Text className="text-2xl font-bold mb-1 text-[#1a1a1a]">{jugador.equipo}</Text>
          <Text className="text-lg text-gray-500">{jugador.torneo}</Text>
        </View>

        <View className="items-center mb-4">
          {jugador.fotoCarnet && (
            <View className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                source={{ uri: jugador.fotoCarnet }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        <View className="bg-gray-50 rounded-lg p-3">
          <View className="flex-row justify-between items-center py-1.5 border-b border-gray-200">
            <Text className="text-base font-semibold text-gray-500">DNI:</Text>
            <Text className="text-base text-gray-700">{jugador.dni}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-gray-200">
            <Text className="text-base font-semibold text-gray-500">Nombre:</Text>
            <Text className="text-base text-gray-700">{jugador.nombre}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-gray-200">
            <Text className="text-base font-semibold text-gray-500">Apellido:</Text>
            <Text className="text-base text-gray-700">{jugador.apellido}</Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-gray-200">
            <Text className="text-base font-semibold text-gray-500">Fecha Nac:</Text>
            <Text className="text-base text-gray-700">
              {new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')}
            </Text>
          </View>
          <View className="flex-row justify-between items-center py-1.5 border-b border-gray-200">
            <Text className="text-base font-semibold text-gray-500">Categoría:</Text>
            <Text className="text-base text-gray-700">
              Cat {obtenerCategoria(jugador.fechaNacimiento)}
            </Text>
          </View>
        </View>

        {mostrarMotivo && 'motivo' in jugador && jugador.motivo && (
          <View className="mt-4 p-3 bg-[#fff3f3] rounded-lg border border-[#ffcdd2]">
            <Text className="text-base font-bold mb-1 text-[#d32f2f]">Motivo:</Text>
            <Text className="text-sm text-gray-700 leading-5">{jugador.motivo}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}
