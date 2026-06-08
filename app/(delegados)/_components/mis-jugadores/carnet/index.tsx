import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { CarnetDigitalDTO, CarnetDigitalPendienteDTO } from '@/lib/api/clients'
import { Texto } from '@/design-system/componentes'
import { FUENTE_DISPLAY, FUENTE_SANS_BOLD, FUENTE_SANS_SEMIBOLD } from '@/lib/design-system/fuentes'
import { getConfigLiga } from '@/lib/config/liga'
import {
  coloresDetalleCarnet,
  hexConOpacidad,
  hexFranjaCarnet,
  jugadorParaColoresCarnet,
} from '@/lib/utilidades/color-carnet'
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '@/lib/types/estado-jugador'
import { ANCHO_FOTO, COLORES_ESTADO, estilosFoto, GAP_FOTO_TARJETAS } from './carnet-estilos'
import {
  DecoracionCarnet,
  FranjaClausuraSuspendido,
  MarcaAguaLiga,
  PlaceholderFoto,
} from './decoracion-carnet'
import { FichaDatosJugador } from './ficha-datos-jugador'
import { MiniTarjetaDisciplina } from './mini-tarjeta-disciplina'
import { TextoLegible } from './texto-legible'

export interface CarnetProps {
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
  const colorFranja = esInhabilitado ? COLORES_ESTADO.GRIS_FRANJA_INHABILITADO : colorFranjaTorneo
  const colorEquipo = esInhabilitado ? COLORES_ESTADO.GRIS_TEXTO_INHABILITADO : hexLink
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
        esDelegado ? (esInhabilitado ? 'border-2 border-zinc-300' : 'border-2') : 'border-zinc-200'
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
              backgroundColor: esInhabilitado
                ? COLORES_ESTADO.AMARILLO_INHABILITADO
                : obtenerColorEstado(estado),
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
              className={`mt-1.5 text-center text-lg tracking-wide ${esInhabilitado ? 'text-zinc-400' : 'text-zinc-900'}`}
              style={{ fontFamily: FUENTE_SANS_BOLD }}
            >
              {jugador.torneo}
            </Texto>
          </View>

          <View className="items-center border-t border-zinc-200 pt-5">
            {muestraBloqueFoto && (
              <View className="relative w-full items-center">
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
                  <View
                    className="absolute gap-2 pt-2"
                    style={{ left: '50%', marginLeft: ANCHO_FOTO / 2 + GAP_FOTO_TARJETAS }}
                  >
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
