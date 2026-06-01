import React, { useEffect, useMemo, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { getColorLiga600, useConfigLiga } from '@/lib/config/liga'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import { FondoHome } from '@/components/home/fondo-home'
import { PantallaPublica, Texto } from '@/components/ui'
import { FUENTE_BRAND, FUENTE_DISPLAY, FUENTE_SANS } from '@/lib/design-system/fuentes'

/** Verde liga shade 600 (`lib/config/liga.ts`) — buscador de torneos */
const COLOR_VERDE_LIGA = '#16a34a'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

function rgbaDesdeHex(hex: string, alpha: number, intensidadColor = 1): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${Math.round(r * intensidadColor)}, ${Math.round(g * intensidadColor)}, ${Math.round(b * intensidadColor)}, ${alpha})`
}

/** Degradado vertical semitransparente: negro arriba, tinte de liga abajo; deja ver las fotos */
function degradadoFondoHome(colorLiga: string) {
  const colors = [
    'rgba(0, 0, 0, 0.78)',
    'rgba(0, 0, 0, 0.65)',
    'rgba(0, 0, 0, 0.5)',
    rgbaDesdeHex(colorLiga, 0.55, 0.08),
    rgbaDesdeHex(colorLiga, 0.6, 0.18),
    rgbaDesdeHex(colorLiga, 0.68, 0.32),
    rgbaDesdeHex(colorLiga, 0.75, 0.52),
    rgbaDesdeHex(colorLiga, 0.82, 0.75),
  ] as const
  const locations = [0, 0.22, 0.38, 0.52, 0.65, 0.78, 0.9, 1] as const
  return { colors, locations }
}

/** Transparencia del fondo de las cards (0.5 = 50% transparente) */
const OPACIDAD_FONDO_CARD = 0.5

const CARD_FICHAJE = {
  borde: 'rgba(248, 113, 113, 0.55)',
  degradado: [`rgba(220, 38, 38, ${OPACIDAD_FONDO_CARD})`, `rgba(0, 0, 0, ${OPACIDAD_FONDO_CARD})`] as const,
  bordeIcono: 'border-red-500/30',
  fondoIcono: 'bg-red-500/10',
  colorIcono: '#f87171',
}

const CARD_DELEGADOS = {
  borde: 'rgba(56, 189, 248, 0.55)',
  degradado: [`rgba(37, 99, 235, ${OPACIDAD_FONDO_CARD})`, `rgba(0, 0, 0, ${OPACIDAD_FONDO_CARD})`] as const,
  bordeIcono: 'border-sky-500/30',
  fondoIcono: 'bg-sky-500/10',
  colorIcono: '#38bdf8',
}

const BUSCADOR_TORNEOS = {
  borde: 'rgba(52, 211, 153, 0.55)',
  degradado: [`rgba(22, 163, 74, ${OPACIDAD_FONDO_CARD})`, `rgba(0, 0, 0, ${OPACIDAD_FONDO_CARD})`] as const,
  bordeIcono: 'border-emerald-500/30',
  fondoIcono: 'bg-emerald-500/10',
}

function TarjetaAccionHome({
  testID,
  titulo,
  subtitulo,
  onPress,
  borde,
  degradado,
  iconName,
  colorIcono,
  bordeIcono,
  fondoIcono,
  tamanoIcono = 22,
  accessibilityLabel,
}: {
  testID: string
  titulo: string
  subtitulo: string
  onPress: () => void
  borde: string
  degradado: readonly [string, string]
  iconName: IoniconsName
  colorIcono: string
  bordeIcono: string
  fondoIcono: string
  tamanoIcono?: number
  accessibilityLabel: string
}) {
  const paddingContenido = {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  } as const

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      className="flex-1 self-stretch overflow-hidden rounded-2xl"
      style={{ minHeight: 152, borderWidth: 1, borderColor: borde }}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <LinearGradient
        colors={[...degradado]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={paddingContenido}>
        <View
          className={`h-10 w-10 items-center justify-center rounded-lg border ${bordeIcono} ${fondoIcono}`}
        >
          <Ionicons name={iconName} size={tamanoIcono} color={colorIcono} />
        </View>
        <Text
          className="mb-1.5 mt-3 min-h-[20px]"
          style={{
            fontFamily: FUENTE_DISPLAY,
            fontSize: 15,
            color: '#fafafa',
            lineHeight: 20,
          }}
        >
          {titulo}
        </Text>
        <Text
          style={{
            fontFamily: FUENTE_SANS,
            fontSize: 13,
            lineHeight: 18,
            color: '#d4d4d8',
          }}
          numberOfLines={3}
        >
          {subtitulo}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

function BuscadorTorneosHome({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="overflow-hidden rounded-2xl"
      style={{
        borderWidth: 1,
        borderColor: BUSCADOR_TORNEOS.borde,
      }}
      accessibilityRole="button"
      accessibilityLabel="Buscar torneos"
    >
      <LinearGradient
        colors={[...BUSCADOR_TORNEOS.degradado]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View className="flex-row items-center px-4 py-5">
        <View
          className={`mr-3 h-10 w-10 items-center justify-center rounded-lg border ${BUSCADOR_TORNEOS.bordeIcono} ${BUSCADOR_TORNEOS.fondoIcono}`}
        >
          <Feather name="search" size={22} color={COLOR_VERDE_LIGA} />
        </View>
        <Text
          className="flex-1"
          style={{
            fontFamily: FUENTE_DISPLAY,
            fontSize: 15,
            color: '#f4f4f5',
            lineHeight: 20,
          }}
        >
          Buscar torneos
        </Text>
      </View>
    </TouchableOpacity>
  )
}

/** Logos de ligas (require estático para Metro) */
const LOGOS_LIGAS: Record<string, number> = {
  edefi: require('@/assets/ligas/edefi/icon.png'),
  luefi: require('@/assets/ligas/luefi/icono.png'),
}

export default function HomeMobile() {
  const router = useRouter()
  const { logout } = useAuth()
  const { limpiarEquipoSeleccionado } = useEquipoStore()
  const { limpiarLiga } = useLigaStore()
  const esMultiliga = Constants.expoConfig?.extra?.esMultiliga === true
  const configLiga = useConfigLiga()
  const colorLiga = getColorLiga600()
  const fondoDegradado = useMemo(() => degradadoFondoHome(colorLiga), [colorLiga])

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
    <View style={estilos.pantalla}>
      <View style={estilos.fondo} pointerEvents="none">
        <FondoHome />
        <LinearGradient
          colors={fondoDegradado.colors}
          locations={fondoDegradado.locations}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <PantallaPublica
        safeArea={false}
        className="flex-1 bg-transparent"
        style={estilos.contenido}
      >
      <View className="flex-1">
      <View className="pb-8 px-6 pt-14">
        <View className="mb-8 mt-4 w-full items-center">
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

        <BuscadorTorneosHome onPress={handleBuscarEquipo} />
      </View>

      <View className="flex-row items-stretch gap-3 px-6 pb-6 pt-3">
        <TarjetaAccionHome
          testID="card-fichaje"
          titulo="Fichaje"
          subtitulo="Fichaje de nuevo jugador de la liga"
          iconName="person-add-outline"
          onPress={handleFichajes}
          borde={CARD_FICHAJE.borde}
          degradado={CARD_FICHAJE.degradado}
          bordeIcono={CARD_FICHAJE.bordeIcono}
          fondoIcono={CARD_FICHAJE.fondoIcono}
          colorIcono={CARD_FICHAJE.colorIcono}
          accessibilityLabel="Fichaje. Fichaje de nuevo jugador de la liga"
        />
        <TarjetaAccionHome
          testID="card-delegados"
          titulo="Delegados"
          subtitulo="Accedé a tu panel de gestión"
          iconName="clipboard-outline"
          tamanoIcono={20}
          onPress={handleDelegadosDT}
          borde={CARD_DELEGADOS.borde}
          degradado={CARD_DELEGADOS.degradado}
          bordeIcono={CARD_DELEGADOS.bordeIcono}
          fondoIcono={CARD_DELEGADOS.fondoIcono}
          colorIcono={CARD_DELEGADOS.colorIcono}
          accessibilityLabel="Delegados. Accedé a tu panel de gestión"
        />
      </View>

      {esMultiliga && (
        <TouchableOpacity
          onPress={handleSeleccionarOtraLiga}
          className="items-center py-2 pb-8"
        >
          <Texto variante="caption">Seleccionar otra liga</Texto>
        </TouchableOpacity>
      )}
      </View>
      </PantallaPublica>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  fondo: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  contenido: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
})
