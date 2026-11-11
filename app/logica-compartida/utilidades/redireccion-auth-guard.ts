import { RUTAS, type RutaApp } from '@/logica-compartida/constantes/rutas'
import { tieneSegmento } from '@/logica-compartida/utilidades/segmentos-ruta'

export type EstadoAuthGuard = {
  segments: readonly string[]
  esMultiliga: boolean
  ligaSeleccionadaId: string | null | undefined
  isAuthenticated: boolean
  equipoSeleccionadoId: number | string | null | undefined
}

/** Pantallas a las que se entra sin login. */
const SEGMENTOS_SIN_LOGIN = [
  'inicio-de-sesion',
  'cambiar-password',
  'seleccion-de-liga',
  'home',
  'fichajes',
  'registro-delegado',
  'registro-arbitro',
  'torneos',
  'torneo-detalle',
  'zona-detalle',
] as const

/**
 * Pantallas a las que un delegado logueado puede entrar sin haber elegido equipo.
 * `registro-arbitro` se abre por deep link (el árbitro puede usar el celular de un delegado),
 * así que no se lo manda a elegir equipo.
 */
const SEGMENTOS_SIN_EQUIPO = ['seleccion-de-equipo', 'registro-arbitro'] as const

/**
 * Decide a dónde redirige el auth guard de `app/_layout.tsx`.
 * Devuelve `null` si la pantalla actual está permitida.
 */
export function redireccionAuthGuard(estado: EstadoAuthGuard): RutaApp | null {
  const { segments, esMultiliga, ligaSeleccionadaId, isAuthenticated, equipoSeleccionadoId } =
    estado
  const en = (segmento: string) => tieneSegmento(segments, segmento)

  if (esMultiliga && !ligaSeleccionadaId && !en('seleccion-de-liga')) {
    return RUTAS.SELECCION_LIGA
  }

  const inAuth = en('inicio-de-sesion') || en('cambiar-password')

  if (!isAuthenticated) {
    return SEGMENTOS_SIN_LOGIN.some(en) ? null : RUTAS.HOME
  }
  if (inAuth) return RUTAS.SELECCION_EQUIPO
  if (!equipoSeleccionadoId && !SEGMENTOS_SIN_EQUIPO.some(en)) return RUTAS.SELECCION_EQUIPO
  return null
}
