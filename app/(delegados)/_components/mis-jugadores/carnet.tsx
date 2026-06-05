import React from 'react'
import { View, Text, Image, Pressable, StyleSheet, type TextProps } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { CarnetDigitalDTO, CarnetDigitalPendienteDTO } from '@/lib/api/clients'
import { Texto } from '@/design-system/componentes'
import { FUENTE_DISPLAY, FUENTE_SANS_BOLD, FUENTE_SANS_SEMIBOLD } from '@/lib/design-system/fuentes'
import { getConfigLiga } from '@/lib/config/liga'
import { coloresDetalleCarnet, hexFranjaCarnet } from '@/lib/utilidades/color-carnet'
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
type IconoIonFicha = React.ComponentProps<typeof Ionicons>['name']

function ColumnaDato({
  iconoFeather,
  iconoIon,
  valor,
  descripcionAccesibilidad,
  colorIcono,
  classNameValor = 'text-zinc-900',
}: {
  iconoFeather?: IconoFeatherFicha
  iconoIon?: IconoIonFicha
  valor: string
  descripcionAccesibilidad: string
  colorIcono: string
  classNameValor?: string
}) {
  return (
    <View
      className="min-w-0 flex-1 items-center px-1"
      accessibilityLabel={`${descripcionAccesibilidad}: ${valor}`}
    >
      {iconoIon ? (
        <Ionicons name={iconoIon} size={18} color={colorIcono} />
      ) : (
        <Feather name={iconoFeather!} size={17} color={colorIcono} />
      )}
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

/** Tres datos en fila: icono + valor, sin recuadro. */
function FichaDatosJugador({
  dni,
  fechaNacimiento,
  categoria,
  colorIcono,
  classNameValor,
}: {
  dni: string
  fechaNacimiento: string
  categoria: string
  colorIcono: string
  classNameValor?: string
}) {
  return (
    <View className="w-full max-w-sm flex-row border-t border-zinc-200 pt-4">
      <ColumnaDato
        iconoFeather="credit-card"
        valor={dni}
        descripcionAccesibilidad="DNI"
        colorIcono={colorIcono}
        classNameValor={classNameValor}
      />
      <View className="w-px self-stretch bg-zinc-200" accessibilityElementsHidden />
      <ColumnaDato
        iconoFeather="calendar"
        valor={fechaNacimiento}
        descripcionAccesibilidad="Fecha de nacimiento"
        colorIcono={colorIcono}
        classNameValor={classNameValor}
      />
      <View className="w-px self-stretch bg-zinc-200" accessibilityElementsHidden />
      <ColumnaDato
        iconoIon="football-outline"
        valor={`Cat '${categoria}`}
        descripcionAccesibilidad="Categoría"
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
const GRIS_ICONO_INHABILITADO = '#A1A1AA'
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
  mostrarEstado?: boolean
  mostrarMotivo?: boolean
  onLongPress?: () => void
  onPress?: () => void
  seleccionado?: boolean
  modoSeleccion?: boolean
}

export default function Carnet({
  jugador,
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
  const categoria = añoNacimiento.toString().slice(-2)

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
  const { hexIcono, hexLink } = coloresDetalleCarnet(jugador)
  const colorFranjaTorneo = hexFranjaCarnet(jugador)
  const colorFranja = esInhabilitado ? GRIS_FRANJA_INHABILITADO : colorFranjaTorneo
  const colorEquipo = esInhabilitado ? GRIS_TEXTO_INHABILITADO : hexLink
  const colorIconoFicha = esInhabilitado ? GRIS_ICONO_INHABILITADO : hexIcono
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
            : 'border-2 border-liga-600'
          : 'border-zinc-200'
      }`}
      style={estilosFoto.carnet}
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
            className={`border-b px-4 py-2 ${
              esInhabilitado ? 'border-zinc-300 bg-zinc-300' : 'border-liga-600/30 bg-liga-50'
            }`}
          >
            <Text
              className={`text-center text-xs uppercase tracking-wider ${
                esInhabilitado ? 'text-zinc-500' : 'text-liga-800'
              }`}
              style={{ fontFamily: FUENTE_SANS_SEMIBOLD }}
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
                categoria={categoria}
                colorIcono={colorIconoFicha}
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
