import React, { useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import useApiQuery from '../api/custom-hooks/use-api-query'
import { api } from '../api/api'
import { CarnetDigitalDTO } from '../api/clients'
import { useEquipoStore } from '../hooks/use-equipo-store'
import { useAuth } from '../hooks/use-auth'
import { queryKeys } from '../api/query-keys'
import Carnet from '../components/carnet'

export default function MisJugadoresScreen() {
  const { equipoSeleccionadoId } = useEquipoStore()
  const { isAuthenticated } = useAuth()
  const scrollViewRef = useRef<ScrollView>(null)
  const [categoryPositions, setCategoryPositions] = useState<Record<number, number>>({})

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
    return <Text className="text-base text-center p-5">Cargando jugadores...</Text>
  }

  if (isError || !jugadores) {
    return <Text className="text-base text-center p-5">Error al cargar los jugadores.</Text>
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

  return (
    <View className="flex-1 bg-[#f8f8f8]">
      <View className="bg-white py-2.5 border-b border-gray-200 z-[1]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {categorias.map((año) => (
            <TouchableOpacity
              key={`button-${año}`}
              className="bg-primary px-5 py-2 rounded-full mx-1.5"
              onPress={() => scrollToCategory(año)}
            >
              <Text className="text-white text-base font-semibold">{año}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView ref={scrollViewRef} className="flex-1">
        <View className="p-2.5">
          {categorias.map((año) => (
            <View key={año} onLayout={(event) => handleCategoryLayout(año, event)}>
              <View className="bg-primary p-3 mb-4 rounded-lg shadow-md">
                <Text className="text-white text-lg font-bold text-center">Categoría {año}</Text>
              </View>
              {jugadoresPorCategoria[año].map((jugador) => (
                <Carnet key={jugador.id} jugador={jugador} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
