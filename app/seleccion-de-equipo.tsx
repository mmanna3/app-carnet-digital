import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import useApiQuery from './api/custom-hooks/use-api-query'
import { api } from './api/api'
import { EquipoBaseDTO } from './api/clients'
import { useEquipoStore } from './hooks/use-equipo-store'
import { queryKeys } from './api/query-keys'

export default function TeamSelectionScreen() {
  const { data, isLoading, isError } = useApiQuery({
    key: queryKeys.equipos.all,
    fn: async () => await api.equiposDelDelegado(),
    transformarResultado: (resultado) => resultado,
  })

  const { seleccionarEquipo } = useEquipoStore()

  const handleTeamSelect = (team: EquipoBaseDTO) => {
    if (team.id && team.nombre) {
      seleccionarEquipo(team.id, team.nombre)
      router.replace('/mis-jugadores')
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#f8f8f8] p-5">
        <Text className="text-2xl font-bold text-center">Cargando equipos...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 bg-[#f8f8f8] p-5">
        <Text className="text-2xl font-bold text-center">Error al cargar los equipos</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: EquipoBaseDTO }) => (
    <TouchableOpacity
      onPress={() => handleTeamSelect(item)}
      className="bg-white p-5 my-2 rounded-lg shadow-sm"
    >
      <Text className="text-lg font-bold">{item.nombre}</Text>
      <Text className="text-sm text-gray-500 mt-1">Torneo: {item.torneo}</Text>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-[#f8f8f8] p-5">
      <Text className="text-2xl font-bold text-center mb-2.5">Selecciona tu equipo</Text>
      <Text className="text-base text-center text-gray-500 mb-5">
        Debes seleccionar un equipo para continuar
      </Text>
      {data && (
        <FlatList
          data={data.equipos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id!.toString()}
          className="flex-1"
        />
      )}
    </View>
  )
}
