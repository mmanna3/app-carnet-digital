/** Liga que vive dentro de la app MULTILIGA. Solo datos para API, colores y display. */
export interface LigaEnAppMultiliga {
  leagueId: string
  leagueDisplayName: string
  apiUrl: string
  colorBase: 'verde' | 'negro' | 'azul' | 'rojo'
}

/** Liga con su propia app compilada (UNILIGA). Incluye config de app para stores. */
export interface LigaConAppPropia {
  leagueId: string
  leagueDisplayName: string
  appName: string
  /** Nombre corto para splash (evita que se corte en pantallas chicas) */
  splashScreenName?: string
  appId: string
  expoSlug: string
  easProjectId: string
  scheme: string
  icon: string
  splashImage: string
  adaptiveIconForeground: string
  favicon: string
  apiUrl: string
  colorBase: 'verde' | 'negro' | 'azul' | 'rojo'
  ios: {
    supportsTablet: boolean
    infoPlist: Record<string, unknown>
  }
}
