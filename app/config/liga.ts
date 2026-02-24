import Constants from 'expo-constants'
import { useLigaStore } from '../hooks/use-liga-store'

export interface ConfigLigaRuntime {
  leagueId: string
  leagueDisplayName: string
  apiUrl: string
  colorBase?: 'verde' | 'negro' | 'azul' | 'rojo'
}

const extra = Constants.expoConfig?.extra
const esMultiliga = extra?.esMultiliga === true

/**
 * URL del mock server para tests E2E.
 * Inlineada por Metro cuando se arranca con EXPO_PUBLIC_E2E_API_URL=...
 * Tiene prioridad sobre __DEV__ y extra.apiUrl.
 */
const E2E_API_URL = process.env.EXPO_PUBLIC_E2E_API_URL || null

/** Ligas disponibles en MULTILIGA (desde extra, indexadas por leagueId) */
const ligasDisponiblesMap = (() => {
  const arr = extra?.ligasDisponibles ?? []
  const map: Record<string, ConfigLigaRuntime> = {}
  for (const l of arr) {
    if (l?.leagueId) map[l.leagueId] = l
  }
  return map
})()

/**
 * Obtiene la config de liga actual.
 * UNILIGA: desde extra (fija en build).
 * MULTILIGA: desde store + ligasDisponibles (selección del usuario).
 */
function getConfigLigaFromStore(): ConfigLigaRuntime | null {
  if (esMultiliga) {
    const ligaId = useLigaStore.getState().ligaSeleccionadaId
    if (!ligaId) return null
    const liga = ligasDisponiblesMap[ligaId]
    return liga
      ? {
          leagueId: liga.leagueId,
          leagueDisplayName: liga.leagueDisplayName,
          apiUrl: E2E_API_URL ?? (__DEV__ ? 'http://192.168.0.66:5072' : liga.apiUrl),
          colorBase: liga.colorBase,
        }
      : null
  }
  if (!extra?.leagueId) return null
  return {
    leagueId: extra.leagueId,
    leagueDisplayName: extra.leagueDisplayName ?? '',
    apiUrl: E2E_API_URL ?? (__DEV__ ? 'http://192.168.0.66:5072' : (extra.apiUrl ?? '')),
    colorBase: extra.colorBase,
  }
}

/** Config actual (para uso en hooks que necesitan reactividad) */
export function useConfigLiga(): ConfigLigaRuntime | null {
  const ligaId = useLigaStore((s) => s.ligaSeleccionadaId)
  return getConfigLigaFromStore()
}

/** Config actual (para uso fuera de React; usa getState) */
export function getConfigLiga(): ConfigLigaRuntime | null {
  return getConfigLigaFromStore()
}

/** @deprecated Usar getConfigLiga() o useConfigLiga(). Mantener por compatibilidad. */
export const configLiga = {
  get leagueId() {
    return getConfigLiga()?.leagueId
  },
  get leagueDisplayName() {
    return getConfigLiga()?.leagueDisplayName
  },
  get apiUrl() {
    return getConfigLiga()?.apiUrl
  },
  get colorBase() {
    return getConfigLiga()?.colorBase
  },
}
