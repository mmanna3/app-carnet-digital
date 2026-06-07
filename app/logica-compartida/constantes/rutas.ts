/** Rutas públicas de la app (paths sin route groups). */
export const RUTAS = {
  INICIO: '/',
  HOME: '/home',
  FICHAJES: '/fichajes',
  REGISTRO_DELEGADO: '/registro-delegado',
  FICHAJE_DELEGADO: '/fichaje-delegado',
  SELECCION_LIGA: '/seleccion-de-liga',
  SELECCION_EQUIPO: '/seleccion-de-equipo',
  LOGIN: '/inicio-de-sesion',
  CAMBIAR_PASSWORD: '/cambiar-password',
  MIS_JUGADORES: '/mis-jugadores',
  BUSCAR: '/buscar',
  PENDIENTES: '/pendientes',
  TORNEOS: '/torneos',
  TORNEO_DETALLE: '/torneos/torneo-detalle',
  ZONA_DETALLE: '/torneos/zona-detalle',
} as const

export type RutaApp = (typeof RUTAS)[keyof typeof RUTAS]

/** Segmentos de ruta visibles (sin paréntesis) para el auth guard. */
export const SEGMENTOS_RUTAS_PUBLICAS = [
  'home',
  'fichajes',
  'registro-delegado',
  'torneos',
  'torneo-detalle',
  'zona-detalle',
  'seleccion-de-liga',
] as const
