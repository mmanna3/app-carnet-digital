import React, { useEffect, useMemo, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { getColorLiga600, useConfigLiga } from '@/lib/config/liga'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import { FondoHome } from '@/home/_components/fondo-home'
import { PantallaPublica, Texto } from '@/design-system/componentes'
import { FUENTE_BRAND, FUENTE_DISPLAY, FUENTE_SANS } from '@/lib/design-system/fuentes'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

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

const OPACIDAD_COLOR_CARD = 0.72
const OPACIDAD_NEGRO_CARD = 0.55

const CARD_FICHAJE = {
  borde: 'rgba(248, 113, 113, 0.7)',
  degradado: [
    `rgba(220, 38, 38, ${OPACIDAD_COLOR_CARD})`,
    `rgba(0, 0, 0, ${OPACIDAD_NEGRO_CARD})`,
  ] as const,
  bordeIcono: 'rgba(248, 113, 113, 0.7)',
  fondoIcono: 'rgba(220, 38, 38, 0.2)',
  colorIcono: '#f87171',
}

const CARD_DELEGADOS = {
  borde: 'rgba(56, 189, 248, 0.7)',
  degradado: [
    `rgba(37, 99, 235, ${OPACIDAD_COLOR_CARD})`,
    `rgba(0, 0, 0, ${OPACIDAD_NEGRO_CARD})`,
  ] as const,
  bordeIcono: 'rgba(56, 189, 248, 0.7)',
  fondoIcono: 'rgba(37, 99, 235, 0.2)',
  colorIcono: '#38bdf8',
}

const CARD_RESULTADOS = {
  borde: 'rgba(74, 222, 128, 0.7)',
  degradado: [
    `rgba(22, 163, 74, ${OPACIDAD_COLOR_CARD})`,
    `rgba(0, 0, 0, ${OPACIDAD_NEGRO_CARD})`,
  ] as const,
  bordeIcono: 'rgba(74, 222, 128, 0.7)',
  fondoIcono: 'rgba(22, 163, 74, 0.2)',
  colorIcono: '#4ade80',
}

const estilosIconoCard = StyleSheet.create({
  caja: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
})

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
      style={{ minHeight: 152, borderWidth: 1.5, borderColor: borde }}
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
          style={[estilosIconoCard.caja, { borderColor: bordeIcono, backgroundColor: fondoIcono }]}
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

function TarjetaResultadosHome({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      testID="card-resultados"
      onPress={onPress}
      activeOpacity={0.85}
      className="overflow-hidden rounded-2xl"
      style={{
        borderWidth: 1.5,
        borderColor: CARD_RESULTADOS.borde,
        minHeight: 112,
      }}
      accessibilityRole="button"
      accessibilityLabel="Ver resultados. Fixture, posiciones y clubes de cada torneo."
    >
      <LinearGradient
        colors={[...CARD_RESULTADOS.degradado]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View className="flex-row items-start px-5 py-5">
        <View
          style={[
            estilosIconoCard.caja,
            {
              borderColor: CARD_RESULTADOS.bordeIcono,
              backgroundColor: CARD_RESULTADOS.fondoIcono,
            },
          ]}
        >
          <Ionicons name="football-outline" size={26} color={CARD_RESULTADOS.colorIcono} />
        </View>
        <View className="ml-4 min-w-0 flex-1">
          <Text
            style={{
              fontFamily: FUENTE_DISPLAY,
              fontSize: 17,
              color: '#fafafa',
              lineHeight: 22,
              letterSpacing: 0.3,
            }}
          >
            Ver resultados
          </Text>
          <Text
            style={{
              fontFamily: FUENTE_SANS,
              fontSize: 13,
              lineHeight: 18,
              color: '#d4d4d8',
              marginTop: 4,
            }}
            numberOfLines={2}
          >
            Fixture, posiciones, jornadas y clubes de cada torneo.
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={22}
          color="rgba(255, 255, 255, 0.45)"
          style={{ marginLeft: 8, alignSelf: 'center' }}
        />
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
    router.push(RUTAS.LOGIN)
  }

  const handleFichajes = () => {
    void cargarFichajeEstaHabilitado()
    router.push(RUTAS.FICHAJES)
  }

  const handleVerResultados = () => {
    router.push(RUTAS.TORNEOS)
  }

  const handleSeleccionarOtraLiga = () => {
    logout()
    limpiarEquipoSeleccionado()
    limpiarLiga()
    router.replace(RUTAS.SELECCION_LIGA)
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
      <PantallaPublica safeArea={false} className="flex-1 bg-transparent" style={estilos.contenido}>
        <View className="flex-1">
          <View className="px-6 pb-4 pt-14">
            <View className="mb-6 mt-4 w-full items-center">
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

            <TarjetaResultadosHome onPress={handleVerResultados} />
          </View>

          <View className="flex-row items-stretch gap-3 px-6 pb-6 pt-2">
            <TarjetaAccionHome
              testID="card-fichaje"
              titulo="Fichaje"
              subtitulo="Fichaje de nuevo jugador de la liga."
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
              subtitulo="Accedé a tu panel de gestión."
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  contenido: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
})
