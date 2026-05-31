import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import { Feather , Ionicons } from '@expo/vector-icons'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { getColorLiga600, useConfigLiga } from '@/lib/config/liga'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import { PantallaPublica, Texto } from '@/components/ui'
import { TOKENS } from '@/lib/design-system'
import { FUENTE_BRAND, FUENTE_SANS } from '@/lib/design-system/fuentes'

/** Logos de ligas (require estático para Metro) */
const LOGOS_LIGAS: Record<string, number> = {
  edefi: require('@/assets/ligas/edefi/icon.png'),
  luefi: require('@/assets/ligas/luefi/icono.png'),
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

function TarjetaAccion({
  testID,
  onPress,
  iconName,
  titulo,
  subtitulo,
  colorIcono,
  bordeIcono,
  fondoIcono,
}: {
  testID?: string
  onPress: () => void
  iconName: IoniconsName
  titulo: string
  subtitulo: string
  colorIcono: string
  bordeIcono: string
  fondoIcono: string
}) {
  return (
    <TouchableOpacity testID={testID} onPress={onPress} className="flex-1" activeOpacity={0.85}>
      <View className={`rounded-2xl border border-zinc-700 bg-surface-elevated p-4 ${bordeIcono}`}>
        <View
          className={`mb-3 h-10 w-10 items-center justify-center rounded-lg border ${bordeIcono} ${fondoIcono}`}
        >
          <Ionicons name={iconName} size={22} color={colorIcono} />
        </View>
        <Texto variante="titulo" className="mb-1 text-sm" style={{ color: '#fafafa' }}>
          {titulo}
        </Texto>
        <Text
          className="text-sm leading-snug"
          style={{ fontFamily: FUENTE_SANS, color: '#d4d4d8' }}
        >
          {subtitulo}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function HomeMobile() {
  const router = useRouter()
  const { logout } = useAuth()
  const { limpiarEquipoSeleccionado } = useEquipoStore()
  const { limpiarLiga } = useLigaStore()
  const esMultiliga = Constants.expoConfig?.extra?.esMultiliga === true
  const configLiga = useConfigLiga()
  const colorLiga = getColorLiga600()

  const leagueId = configLiga?.leagueId ?? ''
  const leagueDisplayName = configLiga?.leagueDisplayName ?? ''
  const logo = leagueId ? LOGOS_LIGAS[leagueId] : undefined
  const cargarFichajeEstaHabilitado = useConfiguracionFichajeStore(
    (s) => s.cargarFichajeEstaHabilitado
  )
  const ligaPrevParaConfigFichaje = useRef<string>('')

  useEffect(() => {
    if (!leagueId) {
      useConfiguracionFichajeStore.setState({ fichajeEstaHabilitado: null })
      ligaPrevParaConfigFichaje.current = ''
      return
    }
    if (ligaPrevParaConfigFichaje.current !== leagueId) {
      useConfiguracionFichajeStore.setState({ fichajeEstaHabilitado: null })
      ligaPrevParaConfigFichaje.current = leagueId
    }
  }, [leagueId])

  const handleDelegadosDT = () => {
    void cargarFichajeEstaHabilitado()
    router.push('/(auth)/login')
  }

  const handleFichajes = () => {
    void cargarFichajeEstaHabilitado()
    router.push('/fichajes')
  }

  const handleBuscarEquipo = () => {
    router.push('/torneos')
  }

  const handleSeleccionarOtraLiga = () => {
    logout()
    limpiarEquipoSeleccionado()
    limpiarLiga()
    router.replace('/seleccion-de-liga' as any)
  }

  return (
    <PantallaPublica safeArea={false} className="flex-1">
      <View className="pb-8 px-6 pt-14" style={{ backgroundColor: colorLiga }}>
        <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
          <View
            className="absolute rounded-full bg-white/10"
            style={{ top: -64, right: -64, width: 192, height: 192 }}
          />
          <View
            className="absolute rounded-full bg-white/10"
            style={{ bottom: -48, left: -48, width: 144, height: 144 }}
          />
        </View>

        <View className="mb-4 mt-4 w-full items-center">
          {logo && (
            <Image
              source={logo}
              style={{ width: 96, height: 96 }}
              className="mb-4"
              resizeMode="contain"
            />
          )}
          <View className="w-full px-2">
            <Text
              className="text-center text-white"
              style={{
                fontFamily: FUENTE_BRAND,
                fontSize: 32,
                letterSpacing: 2,
              }}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {leagueDisplayName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleBuscarEquipo}
          activeOpacity={0.85}
          className="flex-row items-center rounded-full border border-white/25 bg-white px-4 py-3.5"
          accessibilityRole="button"
          accessibilityLabel="Buscar torneos"
        >
          <Feather name="search" size={20} color="#9ca3af" />
          <Text className="ml-2 text-base text-gray-500">Buscar torneos...</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3 bg-surface px-6 pb-6 pt-6">
        <TarjetaAccion
          testID="card-fichaje"
          onPress={handleFichajes}
          iconName="person-add-outline"
          titulo="Fichaje"
          subtitulo="Fichaje de nuevo jugador de la liga"
          colorIcono={TOKENS.accentHot}
          bordeIcono="border-emerald-500/30"
          fondoIcono="bg-emerald-500/10"
        />
        <TarjetaAccion
          testID="card-delegados"
          onPress={handleDelegadosDT}
          iconName="clipboard-outline"
          titulo="Delegados/DT"
          subtitulo="Accedé a tu panel de gestión"
          colorIcono="#38bdf8"
          bordeIcono="border-sky-500/30"
          fondoIcono="bg-sky-500/10"
        />
      </View>

      {esMultiliga && (
        <TouchableOpacity
          onPress={handleSeleccionarOtraLiga}
          className="items-center bg-surface py-2 pb-8"
        >
          <Texto variante="caption">Seleccionar otra liga</Texto>
        </TouchableOpacity>
      )}
    </PantallaPublica>
  )
}
