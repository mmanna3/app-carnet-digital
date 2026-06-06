import React from 'react'
import { View, Text, Image, Pressable, StyleSheet, type TextProps } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { CarnetDigitalDTO, CarnetDigitalPendienteDTO } from '@/lib/api/clients'
import { Texto } from '@/design-system/componentes'
import { FUENTE_DISPLAY, FUENTE_SANS_BOLD, FUENTE_SANS_SEMIBOLD } from '@/lib/design-system/fuentes'
import { getConfigLiga } from '@/lib/config/liga'
import { coloresDetalleCarnet, hexFranjaCarnet, jugadorParaColoresCarnet } from '@/lib/utilidades/color-carnet'
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '@/lib/types/estado-jugador'

/** Logos por liga (require estático para Metro; mismas rutas que home). */
const LOGOS_LIGAS: Record<string, number> = {
  edefi: require('@/assets/ligas/edefi/icon.png'),
  luefi: require('@/assets/ligas/luefi/icono.png'),
}

const estilosFoto = StyleSheet.create({
  marco: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  carnet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },
})

function TextoLegible({
  className = '',
  style,
  children,
  ...rest
}: TextProps & { children: React.ReactNode }) {
  return (
    <Text className={className} style={[{ fontFamily: FUENTE_SANS_BOLD }, style]} {...rest}>
      {children}
    </Text>
  )
}

function MiniTarjetaDisciplina({
  cantidad,
  variante,
}: {
  cantidad: number
  variante: 'amarilla' | 'roja'
}) {
  const esAmarilla = variante === 'amarilla'
  return (
    <View
      className={`h-9 min-w-[26px] items-center justify-center rounded px-1 ${
        esAmarilla ? 'border border-amber-600 bg-yellow-400' : 'border border-red-900 bg-red-600'
      }`}
      accessibilityLabel={esAmarilla ? 'Tarjetas amarillas' : 'Tarjetas rojas'}
    >
      <Text
        className={`text-sm font-bold tabular-nums ${esAmarilla ? 'text-gray-900' : 'text-white'}`}
      >
        {cantidad}
      </Text>
    </View>
  )
}

type IconoFeatherFicha = React.ComponentProps<typeof Feather>['name']

function ColumnaCategoria({
  etiqueta,
  colorEquipo,
  compacto = false,
}: {
  etiqueta: string
  colorEquipo: string
  compacto?: boolean
}) {
  const fondoOscuro = oscurecerHex(colorEquipo, 0.72)

  return (
    <View
      className="shrink-0 flex-[1.56] items-center justify-center px-1"
      accessibilityLabel={compacto ? 'Categoría: DT/Delegado' : `Categoría: ${etiqueta}`}
    >
      <View
        className={`overflow-hidden rounded-full ${compacto ? 'px-4 py-2' : 'px-7 py-2'}`}
        style={{
          borderWidth: 1.5,
          borderColor: hexConOpacidad(fondoOscuro, 0.85),
        }}
      >
        <LinearGradient
          colors={[colorEquipo, fondoOscuro]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {compacto ? (
          <Text
            className="text-center uppercase text-zinc-50"
            style={{
              fontFamily: FUENTE_DISPLAY,
              fontSize: 13,
              lineHeight: 15,
              letterSpacing: 0.5,
            }}
          >
            DT/{'\n'}Delegado
          </Text>
        ) : (
          <Text
            className="text-center uppercase text-zinc-50"
            style={{
              fontFamily: FUENTE_DISPLAY,
              fontSize: 22,
              lineHeight: 26,
              letterSpacing: 1,
            }}
            numberOfLines={1}
          >
            {etiqueta}
          </Text>
        )}
      </View>
    </View>
  )
}

function ColumnaDato({
  iconoFeather,
  valor,
  descripcionAccesibilidad,
  colorIcono,
  classNameValor = 'text-zinc-900',
}: {
  iconoFeather: IconoFeatherFicha
  valor: string
  descripcionAccesibilidad: string
  colorIcono: string
  classNameValor?: string
}) {
  return (
    <View
      className="min-w-0 flex-[0.72] items-center px-0.5"
      accessibilityLabel={`${descripcionAccesibilidad}: ${valor}`}
    >
      <Feather name={iconoFeather} size={17} color={colorIcono} />
      <Text
        className={`mt-1.5 text-center text-sm tabular-nums ${classNameValor}`}
        style={{ fontFamily: FUENTE_SANS_SEMIBOLD }}
        numberOfLines={2}
      >
        {valor}
      </Text>
    </View>
  )
}

/** Tres datos en fila: DNI — categoría (pill) — fecha de nacimiento. */
function FichaDatosJugador({
  dni,
  fechaNacimiento,
  etiquetaCategoria,
  esDelegado = false,
  colorEquipo,
  colorIcono,
  classNameValor,
}: {
  dni: string
  fechaNacimiento: string
  etiquetaCategoria: string
  esDelegado?: boolean
  colorEquipo: string
  colorIcono: string
  classNameValor?: string
}) {
  return (
    <View className="w-full max-w-sm flex-row items-center border-t border-zinc-200 pt-4">
      <ColumnaDato
        iconoFeather="credit-card"
        valor={dni}
        descripcionAccesibilidad="DNI"
        colorIcono={colorIcono}
        classNameValor={classNameValor}
      />
      <View className="w-px self-stretch bg-zinc-200" accessibilityElementsHidden />
      <ColumnaCategoria
        etiqueta={etiquetaCategoria}
        colorEquipo={colorEquipo}
        compacto={esDelegado}
      />
      <View className="w-px self-stretch bg-zinc-200" accessibilityElementsHidden />
      <ColumnaDato
        iconoFeather="calendar"
        valor={fechaNacimiento}
        descripcionAccesibilidad="Fecha de nacimiento"
        colorIcono={colorIcono}
        classNameValor={classNameValor}
      />
    </View>
  )
}

function hexConOpacidad(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function oscurecerHex(hex: string, factor: number): string {
  const h = hex.replace('#', '')
  const r = Math.min(255, Math.round(parseInt(h.slice(0, 2), 16) * factor))
  const g = Math.min(255, Math.round(parseInt(h.slice(2, 4), 16) * factor))
  const b = Math.min(255, Math.round(parseInt(h.slice(4, 6), 16) * factor))
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function DecoracionCarnet({ colorLiga }: { colorLiga: string }) {
  return (
    <View pointerEvents="none" className="absolute inset-0 z-0 overflow-hidden">
      <View
        style={{
          position: 'absolute',
          top: -48,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: hexConOpacidad(colorLiga, 0.12),
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -72,
          left: -56,
          width: 200,
          height: 140,
          backgroundColor: hexConOpacidad(colorLiga, 0.08),
          transform: [{ rotate: '24deg' }],
          borderRadius: 12,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 8,
          left: -28,
          width: 72,
          height: 72,
          backgroundColor: hexConOpacidad(colorLiga, 0.06),
          transform: [{ rotate: '45deg' }],
          borderRadius: 4,
        }}
      />
    </View>
  )
}

function PlaceholderFoto({ iniciales }: { iniciales: string }) {
  return (
    <View className="h-48 w-48 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-200">
      <Text
        className="text-3xl text-zinc-500"
        style={{ fontFamily: FUENTE_SANS_SEMIBOLD }}
        accessibilityLabel="Sin foto"
      >
        {iniciales}
      </Text>
    </View>
  )
}

function MarcaAguaLiga({ leagueId }: { leagueId: string | undefined }) {
  const logo = leagueId ? LOGOS_LIGAS[leagueId] : undefined
  if (!logo) return null

  return (
    <View pointerEvents="none" className="absolute right-2 bottom-16 z-0 items-end justify-end">
      <Image
        source={logo}
        accessible={false}
        style={{ width: 200, height: 200, opacity: 0.09 }}
        resizeMode="contain"
      />
    </View>
  )
}

const ROJO_CLAUSURA = '#B71C1C'
const ROJO_CLAUSURA_BORDE = '#5D0000'
const AMARILLO_INHABILITADO = '#FACC15'
const GRIS_TEXTO_INHABILITADO = '#71717A'
const GRIS_FRANJA_INHABILITADO = '#D4D4D8'

/** Cinta oblicua tipo clausura sobre todo el carnet. */
function FranjaClausuraSuspendido() {
  const repeticiones = ['SUSPENDIDO', 'SUSPENDIDO', 'SUSPENDIDO'] as const

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 z-30 overflow-hidden"
      accessibilityLabel="Jugador suspendido"
    >
      <View className="absolute inset-0 bg-black/12" />
      <View
        className="absolute flex-row items-center justify-center gap-8"
        style={{
          top: '36%',
          left: '-28%',
          width: '156%',
          height: 72,
          transform: [{ rotate: '-34deg' }],
          backgroundColor: ROJO_CLAUSURA,
          borderTopWidth: 4,
          borderBottomWidth: 4,
          borderColor: ROJO_CLAUSURA_BORDE,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        {repeticiones.map((texto, i) => (
          <Text
            key={i}
            className="text-white"
            style={{
              fontFamily: FUENTE_DISPLAY,
              fontSize: 26,
              lineHeight: 30,
              letterSpacing: 3,
            }}
          >
            {texto}
          </Text>
        ))}
      </View>
    </View>
  )
}

interface CarnetProps {
  jugador: CarnetDigitalDTO | CarnetDigitalPendienteDTO
  /** Agrupador del equipo cuando el jugador no trae color (p. ej. DT/delegado). */
  colorAgrupadorEquipo?: string
  mostrarEstado?: boolean
  mostrarMotivo?: boolean
  onLongPress?: () => void
  onPress?: () => void
  seleccionado?: boolean
  modoSeleccion?: boolean
}

export default function Carnet({
  jugador,
  colorAgrupadorEquipo,
  mostrarEstado = false,
  mostrarMotivo = false,
  onLongPress,
  onPress,
  seleccionado = false,
  modoSeleccion = false,
}: CarnetProps) {
  const estado = jugador.estado as EstadoJugador
  const esDelegado = jugador.esDelegado === true
  const esSuspendido = estado === EstadoJugador.Suspendido
  const esInhabilitado = estado === EstadoJugador.Inhabilitado
  const debeMostrarFranjaSuperior =
    (mostrarEstado || esInhabilitado || esSuspendido) && !esSuspendido

  const añoNacimiento = new Date(jugador.fechaNacimiento).getFullYear()

  const nombreCompleto = `${jugador.apellido}, ${jugador.nombre}`.trim()
  const iniciales =
    `${jugador.apellido?.[0] ?? ''}${jugador.nombre?.[0] ?? ''}`.toUpperCase() || '?'

  const ta = jugador.tarjetasAmarillas
  const tr = jugador.tarjetasRojas
  const muestraTarjetasAmarillas = typeof ta === 'number' && ta > 0
  const muestraTarjetasRojas = typeof tr === 'number' && tr > 0
  const muestraFoto = Boolean(jugador.fotoCarnet)
  const muestraBloqueFoto =
    muestraFoto || muestraTarjetasAmarillas || muestraTarjetasRojas || !jugador.fotoCarnet

  const fechaNac = new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')
  const jugadorColor = jugadorParaColoresCarnet(jugador, colorAgrupadorEquipo)
  const { hexLink } = coloresDetalleCarnet(jugadorColor)
  const colorFranjaTorneo = hexFranjaCarnet(jugadorColor)
  const colorFranja = esInhabilitado ? GRIS_FRANJA_INHABILITADO : colorFranjaTorneo
  const colorEquipo = esInhabilitado ? GRIS_TEXTO_INHABILITADO : hexLink
  const leagueId = getConfigLiga()?.leagueId

  return (
    <Pressable
      testID={`carnet-jugador-${jugador.id ?? 'unknown'}`}
      accessibilityLabel={`Carnet de ${nombreCompleto}`}
      onPress={modoSeleccion ? onPress : undefined}
      onLongPress={modoSeleccion ? undefined : onLongPress}
      delayLongPress={400}
      className={`relative m-4 overflow-hidden rounded-2xl border ${
        esInhabilitado ? 'bg-zinc-100' : 'bg-white'
      } ${
        esDelegado
          ? esInhabilitado
            ? 'border-2 border-zinc-300'
            : 'border-2'
          : 'border-zinc-200'
      }`}
      style={[
        estilosFoto.carnet,
        esDelegado && !esInhabilitado ? { borderColor: colorFranjaTorneo } : undefined,
      ]}
    >
      <View className="relative z-10 h-1.5" style={{ backgroundColor: colorFranja }} />
      <DecoracionCarnet colorLiga={colorFranja} />
      <MarcaAguaLiga leagueId={leagueId} />

      <View className="relative z-10">
        {modoSeleccion && (
          <View
            className={`absolute top-4 left-3 z-10 h-7 w-7 items-center justify-center rounded-full border-2 ${
              seleccionado ? 'border-green-600 bg-green-100' : 'border-zinc-400 bg-white'
            }`}
          >
            {seleccionado && (
              <Text className="text-base font-bold leading-none text-green-700">✓</Text>
            )}
          </View>
        )}

        {debeMostrarFranjaSuperior && (
          <View
            style={{
              backgroundColor: esInhabilitado ? AMARILLO_INHABILITADO : obtenerColorEstado(estado),
            }}
            className={`items-center justify-center px-4 ${esInhabilitado ? 'min-h-[104px] py-8' : 'py-2.5'}`}
          >
            <Texto
              variante="display"
              className={`text-center ${esInhabilitado ? 'text-3xl tracking-widest text-zinc-950' : 'text-sm text-white'}`}
            >
              {obtenerTextoEstado(estado)}
            </Texto>
          </View>
        )}

        {esDelegado && (
          <View
            className={`border-b px-4 py-2 ${esInhabilitado ? 'border-zinc-300 bg-zinc-300' : ''}`}
            style={
              esInhabilitado
                ? undefined
                : {
                    borderBottomColor: hexConOpacidad(colorEquipo, 0.3),
                    backgroundColor: hexConOpacidad(colorEquipo, 0.08),
                  }
            }
          >
            <Text
              className={`text-center text-xs uppercase tracking-wider ${
                esInhabilitado ? 'text-zinc-500' : ''
              }`}
              style={{
                fontFamily: FUENTE_SANS_SEMIBOLD,
                color: esInhabilitado ? undefined : colorEquipo,
              }}
            >
              DT / Delegado
            </Text>
          </View>
        )}

        <View className="px-6 py-5">
          <View className="mb-5 items-center">
            <TextoLegible
              className={`text-center text-3xl leading-9 tracking-tight ${
                esInhabilitado ? 'text-zinc-500' : 'text-zinc-950'
              }`}
            >
              {nombreCompleto}
            </TextoLegible>
            <Text
              className="mt-2 text-center text-lg uppercase tracking-wide"
              style={{ fontFamily: FUENTE_DISPLAY, color: colorEquipo }}
              numberOfLines={2}
            >
              {jugador.equipo}
            </Text>
            <Texto
              variante="caption"
              className={`mt-1.5 text-center ${esInhabilitado ? 'text-zinc-400' : 'text-zinc-500'}`}
            >
              {jugador.torneo}
            </Texto>
          </View>

          <View className="items-center border-t border-zinc-200 pt-5">
            {muestraBloqueFoto && (
              <View className="flex-row items-start justify-center gap-3">
                <View className="relative" style={estilosFoto.marco}>
                  {muestraFoto ? (
                    <View
                      className={`h-48 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white ${
                        esInhabilitado ? 'opacity-55' : ''
                      }`}
                    >
                      <Image
                        source={{ uri: jugador.fotoCarnet! }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                  ) : (
                    <PlaceholderFoto iniciales={iniciales} />
                  )}
                </View>

                {(muestraTarjetasAmarillas || muestraTarjetasRojas) && (
                  <View className="gap-2 pt-2">
                    {muestraTarjetasAmarillas && (
                      <MiniTarjetaDisciplina cantidad={ta} variante="amarilla" />
                    )}
                    {muestraTarjetasRojas && (
                      <MiniTarjetaDisciplina cantidad={tr} variante="roja" />
                    )}
                  </View>
                )}
              </View>
            )}

            <View className={`w-full items-center ${muestraBloqueFoto ? 'mt-5' : ''}`}>
              <FichaDatosJugador
                dni={String(jugador.dni ?? '—')}
                fechaNacimiento={fechaNac}
                etiquetaCategoria={String(añoNacimiento)}
                esDelegado={esDelegado}
                colorEquipo={colorEquipo}
                colorIcono={colorEquipo}
                classNameValor={esInhabilitado ? 'text-zinc-500' : undefined}
              />
            </View>
          </View>

          {mostrarMotivo && 'motivo' in jugador && jugador.motivo && (
            <View className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <Text
                className="mb-1 text-xs uppercase tracking-wider text-red-800"
                style={{ fontFamily: FUENTE_SANS_SEMIBOLD }}
              >
                Motivo
              </Text>
              <Texto variante="caption" className="leading-5 text-zinc-700">
                {jugador.motivo}
              </Texto>
            </View>
          )}
        </View>
      </View>

      {esSuspendido && <FranjaClausuraSuspendido />}
    </Pressable>
  )
}
