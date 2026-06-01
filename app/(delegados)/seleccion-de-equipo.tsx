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
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import { Texto } from '@/design-system/componentes/texto'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

function BotonCerrarSesion({ onPress }: { onPress: () => void }) {
  return (
    <View className="mb-6">
      <BotonWizard
        testID="boton-cerrar-sesion-seleccion-equipo"
        texto="Cerrar sesión"
        icono="log-out"
        primario={false}
        onPress={onPress}
      />
    </View>
  )
}

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
      router.replace(RUTAS.MIS_JUGADORES)
    }
  }

  const handleCerrarSesion = () => {
    logout()
    limpiarEquipoSeleccionado()
    resetear()
    router.replace(RUTAS.LOGIN)
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface p-5">
        <View className="flex-1 justify-center">
          <Texto variante="titulo" className="text-center">
            Cargando equipos...
          </Texto>
        </View>
        <BotonCerrarSesion onPress={handleCerrarSesion} />
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 bg-surface p-5">
        <View className="flex-1 justify-center">
          <Texto variante="titulo" className="text-center">
            Error al cargar los equipos
          </Texto>
        </View>
        <BotonCerrarSesion onPress={handleCerrarSesion} />
      </View>
    )
  }

  return (
    <View testID="pantalla-seleccion-equipo" className="flex-1 bg-surface p-5">
      <Texto variante="titulo" className="mb-2.5 mt-12 text-center text-zinc-100">
        Seleccioná tu equipo
      </Texto>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {data?.clubsConEquipos?.map((club) => (
          <View key={club.nombre} className="mb-4">
            <Texto variante="cuerpo" className="mb-2 font-semibold text-zinc-200">
              {club.nombre}
            </Texto>
            {club.equipos?.map((equipo) => (
              <TouchableOpacity
                key={equipo.id}
                testID={`item-equipo-${equipo.id}`}
                onPress={() => handleTeamSelect(equipo)}
                className="glass my-2 rounded-xl border border-border-glass px-5 py-4"
              >
                <Texto variante="cuerpo" className="font-semibold text-zinc-100">
                  {equipo.nombre}
                </Texto>
                {equipo.torneo ? (
                  <Text className="text-sm text-zinc-500 mt-1">Torneo: {equipo.torneo}</Text>
                ) : (
                  <Text className="text-sm text-zinc-500 mt-1">Aún no juega ningún torneo</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <BotonCerrarSesion onPress={handleCerrarSesion} />
    </View>
  )
}
