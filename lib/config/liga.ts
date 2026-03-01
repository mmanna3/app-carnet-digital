import Constants from 'expo-constants'
import { useLigaStore } from '@/lib/hooks/use-liga-store'

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
          apiUrl: E2E_API_URL ?? (__DEV__ ? 'http://192.168.0.70:5072' : liga.apiUrl),
          colorBase: liga.colorBase,
        }
      : null
  }
  if (!extra?.leagueId) return null
  return {
    leagueId: extra.leagueId,
    leagueDisplayName: extra.leagueDisplayName ?? '',
    apiUrl: E2E_API_URL ?? (__DEV__ ? 'http://192.168.0.70:5072' : (extra.apiUrl ?? '')),
    colorBase: extra.colorBase,
  }
}

/** Config actual (para uso en hooks que necesitan reactividad) */
export function useConfigLiga(): ConfigLigaRuntime | null {
  useLigaStore((s) => s.ligaSeleccionadaId) // suscripción para reactividad
  return getConfigLigaFromStore()
}

/** Config actual (para uso fuera de React; usa getState) */
export function getConfigLiga(): ConfigLigaRuntime | null {
  return getConfigLigaFromStore()
}

/** Hex del color liga (shade 600, equivalente a bg-liga-600) */
const COLOR_LIGA_600: Record<NonNullable<ConfigLigaRuntime['colorBase']>, string> = {
  verde: '#16a34a',
  negro: '#4b5563',
  azul: '#2563eb',
  rojo: '#dc2626',
}

/** Hex del color liga (shade 200, equivalente a bg-liga-200) */
const COLOR_LIGA_200: Record<NonNullable<ConfigLigaRuntime['colorBase']>, string> = {
  verde: '#bbf7d0',
  negro: '#e5e7eb',
  azul: '#bfdbfe',
  rojo: '#fecaca',
}

/** Hex del color liga (shade 700, equivalente a border-liga-700) */
const COLOR_LIGA_700: Record<NonNullable<ConfigLigaRuntime['colorBase']>, string> = {
  verde: '#15803d',
  negro: '#374151',
  azul: '#1d4ed8',
  rojo: '#b91c1c',
}

export function getColorLiga600(): string {
  const base = getConfigLiga()?.colorBase ?? 'verde'
  return COLOR_LIGA_600[base] ?? COLOR_LIGA_600.verde
}

export function getColorLiga200(): string {
  const base = getConfigLiga()?.colorBase ?? 'verde'
  return COLOR_LIGA_200[base] ?? COLOR_LIGA_200.verde
}

export function getColorLiga700(): string {
  const base = getConfigLiga()?.colorBase ?? 'verde'
  return COLOR_LIGA_700[base] ?? COLOR_LIGA_700.verde
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
