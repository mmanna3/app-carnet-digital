import React from 'react'
import { View, FlatList, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'
import Constants from 'expo-constants'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { PantallaPublica, Texto, Tarjeta, EstadoVacio } from '@/components/ui'

interface LigaDisponible {
  leagueId: string
  leagueDisplayName: string
  apiUrl: string
  colorBase: string
}

const ICONOS_LIGAS: Record<string, ReturnType<typeof require>> = {
  luefi: require('@/assets/ligas/luefi/icono.png'),
}

export default function SeleccionDeLigaScreen() {
  const extra = Constants.expoConfig?.extra
  const ligasDisponibles: LigaDisponible[] = extra?.ligasDisponibles ?? []
  const { seleccionarLiga } = useLigaStore()

  const handleSelect = (liga: LigaDisponible) => {
    seleccionarLiga(liga.leagueId)
    router.replace('/home' as any)
  }

  if (ligasDisponibles.length === 0) {
    return (
      <PantallaPublica className="p-5">
        <EstadoVacio mensaje="No hay ligas configuradas" />
      </PantallaPublica>
    )
  }

  return (
    <PantallaPublica className="px-5 pt-8">
      <Texto variante="display" className="text-center text-2xl normal-case mb-2">
        Seleccioná tu liga
      </Texto>
      <Texto variante="cuerpo" className="text-center mb-6">
        Elegí la liga para continuar
      </Texto>
      <FlatList
        data={ligasDisponibles}
        keyExtractor={(item) => item.leagueId}
        renderItem={({ item }) => {
          const iconSource = ICONOS_LIGAS[item.leagueId]
          return (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              className="my-3"
              activeOpacity={0.85}
            >
              <Tarjeta className="items-center">
                {iconSource ? (
                  <View className="mb-3 h-28 w-28 items-center justify-center rounded-xl border border-border-glass bg-white/5">
                    <Image source={iconSource} className="h-full w-full" resizeMode="contain" />
                  </View>
                ) : null}
                <Texto variante="titulo" className="text-center">
                  {item.leagueDisplayName}
                </Texto>
              </Tarjeta>
            </TouchableOpacity>
          )
        }}
      />
    </PantallaPublica>
  )
}
