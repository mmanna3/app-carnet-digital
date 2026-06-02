import React, { useEffect, useMemo, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { getColorLiga600, useConfigLiga } from '@/lib/config/liga'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import { FondoHome } from '@/home/_components/fondo-home'
import {
  PantallaPublica,
  Texto,
  Tarjeta,
  COLOR_TARJETA,
  ICONO_DONDE,
  VARIANTE_TARJETA,
} from '@/design-system/componentes'
import { FUENTE_BRAND } from '@/lib/design-system/fuentes'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

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

            <Tarjeta
              testID="card-resultados"
              icono="football-outline"
              iconoDonde={ICONO_DONDE.ALCOSTADO}
              titulo="Ver resultados"
              subtitulo="Fixture, posiciones, jornadas y clubes de cada torneo."
              color={COLOR_TARJETA.VERDE}
              mostrarChevron
              onPress={handleVerResultados}
              accessibilityLabel="Ver resultados. Fixture, posiciones y clubes de cada torneo."
            />
          </View>

          <View className="flex-row items-stretch gap-3 px-6 pb-6 pt-2">
            <Tarjeta
              testID="card-fichaje"
              className="flex-1 self-stretch"
              variante={VARIANTE_TARJETA.COMPACTA}
              icono="person-add-outline"
              titulo="Fichaje"
              subtitulo="Exclusivo para jugadores/as."
              color={COLOR_TARJETA.ROJO}
              onPress={handleFichajes}
              accessibilityLabel="Fichaje. Fichaje de nuevo jugador de la liga"
            />
            <Tarjeta
              testID="card-delegados"
              className="flex-1 self-stretch"
              variante={VARIANTE_TARJETA.COMPACTA}
              icono="clipboard-outline"
              titulo="DT/Delegado"
              subtitulo="Accedé a tu panel de gestión."
              color={COLOR_TARJETA.AZUL}
              tamanoIcono={20}
              onPress={handleDelegadosDT}
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
