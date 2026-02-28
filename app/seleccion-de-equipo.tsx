import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { EquipoBaseDTO } from '@/lib/api/clients'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { queryKeys } from '@/lib/api/query-keys'

export default function TeamSelectionScreen() {
  const { data, isLoading, isError } = useApiQuery({
    key: queryKeys.equipos.all,
    fn: async () => await api.equiposDelDelegado(),
    transformarResultado: (resultado) => resultado,
  })

  const { seleccionarEquipo } = useEquipoStore()

  const handleTeamSelect = (team: EquipoBaseDTO) => {
    if (team.id && team.nombre) {
      seleccionarEquipo(team.id, team.nombre, team.codigoAlfanumerico ?? '')
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
      testID={`item-equipo-${item.id}`}
      onPress={() => handleTeamSelect(item)}
      className="bg-white px-5 py-8 my-2 rounded-xl shadow-sm"
    >
      <Text className="text-lg font-bold">{item.nombre}</Text>
      {item.torneo ?
      (<Text className="text-sm text-gray-500 mt-1">Torneo: {item.torneo}</Text>) : 
      (<Text className="text-sm text-gray-500 mt-1">Aún no juega ningún torneo</Text>)}
    </TouchableOpacity>
  )

  return (
    <View testID="pantalla-seleccion-equipo" className="flex-1 bg-[#f8f8f8] p-5">
      <Text className="text-2xl font-bold text-center mb-2.5 mt-12">Seleccioná tu equipo</Text>
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
