import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { EquipoBaseDTO } from '@/lib/api/clients'
import { useAuth } from '@/lib/hooks/use-auth'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import { queryKeys } from '@/lib/api/query-keys'
import Boton from '@/components/boton'

export default function TeamSelectionScreen() {
  const { logout } = useAuth()
  const { limpiarEquipoSeleccionado } = useEquipoStore()
  const { resetear } = useFichajeStore()
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

  const handleCerrarSesion = () => {
    logout()
    limpiarEquipoSeleccionado()
    resetear()
    router.replace('/(auth)/login')
  }

  const BotonCerrarSesion = () => (
    <View className="mb-6 items-end">
      <Boton
        testID="boton-cerrar-sesion-seleccion-equipo"
        texto="Cerrar sesión"
        onPress={handleCerrarSesion}
        variante="Secundario"
        className="h-[40px] px-4 mt-0"
      />
    </View>
  )

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#f8f8f8] p-5">
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-center">Cargando equipos...</Text>
        </View>
        <BotonCerrarSesion />
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 bg-[#f8f8f8] p-5">
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-center">Error al cargar los equipos</Text>
        </View>
        <BotonCerrarSesion />
      </View>
    )
  }

  return (
    <View testID="pantalla-seleccion-equipo" className="flex-1 bg-[#f8f8f8] p-5">
      <Text className="text-2xl font-bold text-center mb-2.5 mt-12">Seleccioná tu equipo</Text>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {data?.clubsConEquipos?.map((club) => (
          <View key={club.nombre} className="mb-4">
            <Text className="text-lg font-bold mb-2">{club.nombre}</Text>
            {club.equipos?.map((equipo) => (
              <TouchableOpacity
                key={equipo.id}
                testID={`item-equipo-${equipo.id}`}
                onPress={() => handleTeamSelect(equipo)}
                className="bg-white px-5 py-4 my-2 rounded-xl shadow-sm"
              >
                <Text className="text-lg font-bold">{equipo.nombre}</Text>
                {equipo.torneo ? (
                  <Text className="text-sm text-gray-500 mt-1">Torneo: {equipo.torneo}</Text>
                ) : (
                  <Text className="text-sm text-gray-500 mt-1">Aún no juega ningún torneo</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <BotonCerrarSesion />
    </View>
  )
}
