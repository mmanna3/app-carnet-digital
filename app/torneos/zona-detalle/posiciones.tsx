import React, { useMemo } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { CategoriasConPosicionesDTO, PosicionDelEquipoDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'

function uriRecursoPublicoApi(apiUrl: string | undefined, ruta: string | undefined): string | null {
  const r = (ruta ?? '').trim()
  if (!r) return null
  if (/^(https?:|data:)/i.test(r)) return r
  const base = apiUrl?.trim()
  if (!base) return null
  return `${base.replace(/\/+$/, '')}${r.startsWith('/') ? r : `/${r}`}`
}

function textoOGuion(s: string | undefined) {
  const t = (s ?? '').trim()
  return t.length > 0 ? t : '—'
}

const ENCABEZADOS = [
  'Pos',
  'Esc',
  'Equipo',
  'J',
  'G',
  'E',
  'P',
  'Np',
  'Gp',
  'Pp',
  'Gf',
  'Gc',
  'Df',
  'Pts',
] as const

/** Anchos mínimos por columna (sin líneas verticales entre columnas). */
const ANCHO = {
  pos: 38,
  esc: 44,
  equipo: 148,
  num: 34,
  goles: 38,
  pts: 40,
} as const

/** Suma exacta de columnas: evita hueco vacío a la derecha al hacer scroll horizontal. */
const ANCHO_TABLA_TOTAL =
  ANCHO.pos +
  ANCHO.esc +
  ANCHO.equipo +
  ANCHO.num * 7 +
  ANCHO.goles * 3 +
  ANCHO.pts

function Celda({
  children,
  ancho,
  alinear = 'left',
  negrita = false,
  tabular = false,
}: {
  children: React.ReactNode
  ancho: number
  alinear?: 'left' | 'center' | 'right'
  negrita?: boolean
  tabular?: boolean
}) {
  const align = alinear === 'center' ? 'center' : alinear === 'right' ? 'right' : 'left'
  return (
    <View style={{ width: ancho, minWidth: ancho }} className="shrink-0 justify-center px-1.5 py-2">
      <Text
        className={`text-sm leading-5 text-gray-800 ${negrita ? 'font-semibold' : ''} ${tabular ? 'tabular-nums' : ''}`}
        style={{ textAlign: align }}
        numberOfLines={2}
      >
        {children}
      </Text>
    </View>
  )
}

function FilaEncabezado() {
  return (
    <View className="flex-row border-b border-gray-300 bg-gray-100">
      {ENCABEZADOS.map((h, i) => {
        const ancho =
          i === 0
            ? ANCHO.pos
            : i === 1
              ? ANCHO.esc
              : i === 2
                ? ANCHO.equipo
                : i >= 10 && i <= 12
                  ? ANCHO.goles
                  : i === 13
                    ? ANCHO.pts
                    : ANCHO.num
        return (
          <Celda
            key={h}
            ancho={ancho}
            alinear={i <= 2 ? 'left' : 'center'}
            negrita
            tabular={i > 2}
          >
            {h}
          </Celda>
        )
      })}
    </View>
  )
}

function FilaEquipo({
  r,
  apiUrl,
}: {
  r: PosicionDelEquipoDTO
  apiUrl: string | undefined
}) {
  const uri = uriRecursoPublicoApi(apiUrl, r.escudo)
  const celdas: { texto: string; ancho: number; alinear: 'left' | 'center' | 'right' }[] = [
    { texto: textoOGuion(r.posicion), ancho: ANCHO.pos, alinear: 'center' },
    { texto: '', ancho: ANCHO.esc, alinear: 'center' },
    { texto: textoOGuion(r.equipo), ancho: ANCHO.equipo, alinear: 'left' },
    { texto: textoOGuion(r.partidosJugados), ancho: ANCHO.num, alinear: 'center' },
    { texto: textoOGuion(r.partidosGanados), ancho: ANCHO.num, alinear: 'center' },
    { texto: textoOGuion(r.partidosEmpatados), ancho: ANCHO.num, alinear: 'center' },
    { texto: textoOGuion(r.partidosPerdidos), ancho: ANCHO.num, alinear: 'center' },
    { texto: textoOGuion(r.partidosNoPresento), ancho: ANCHO.num, alinear: 'center' },
    { texto: textoOGuion(r.partidosGanoPuntos), ancho: ANCHO.num, alinear: 'center' },
    { texto: textoOGuion(r.partidosPerdioPuntos), ancho: ANCHO.num, alinear: 'center' },
    { texto: textoOGuion(r.golesAFavor), ancho: ANCHO.goles, alinear: 'center' },
    { texto: textoOGuion(r.golesEnContra), ancho: ANCHO.goles, alinear: 'center' },
    { texto: textoOGuion(r.golesDiferencia), ancho: ANCHO.goles, alinear: 'center' },
    { texto: textoOGuion(r.puntos), ancho: ANCHO.pts, alinear: 'center' },
  ]

  return (
    <View className="flex-row border-b border-gray-100">
      {celdas.map((c, i) => {
        if (i === 1) {
          return (
            <View
              key="esc"
              style={{ width: ANCHO.esc, minWidth: ANCHO.esc }}
              className="shrink-0 items-center justify-center px-1 py-1.5"
            >
              {uri ? (
                <Image
                  source={{ uri }}
                  style={{ width: 32, height: 32 }}
                  className="rounded-md"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-8 w-8 rounded-md bg-gray-100" />
              )}
            </View>
          )
        }
        return (
          <Celda key={`c-${i}`} ancho={c.ancho} alinear={c.alinear} tabular={i !== 2}>
            {c.texto}
          </Celda>
        )
      })}
    </View>
  )
}

function TablaCategoria({
  bloque,
  apiUrl,
}: {
  bloque: CategoriasConPosicionesDTO
  apiUrl: string | undefined
}) {
  const renglones = bloque.renglones ?? []
  return (
    <View className="mb-5">
      <Text className="mb-2 px-0.5 text-base font-semibold text-gray-900" numberOfLines={2}>
        {textoOGuion(bloque.categoria)}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
        <View style={{ width: ANCHO_TABLA_TOTAL, alignSelf: 'flex-start' }}>
          <FilaEncabezado />
          {renglones.map((r, i) => (
            <FilaEquipo key={`${r.equipo ?? 'eq'}-${i}`} r={r} apiUrl={apiUrl} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default function Posiciones() {
  const configLiga = useConfigLiga()
  const { zonaId: zonaIdParam } = useLocalSearchParams<{ zonaId?: string }>()

  const zonaId = useMemo(() => {
    if (zonaIdParam == null || zonaIdParam === '') return undefined
    const n = Number(zonaIdParam)
    return Number.isFinite(n) ? n : undefined
  }, [zonaIdParam])

  const { data, isLoading, isError, error } = useApiQuery({
    key: queryKeys.zonas.posiciones(zonaId),
    activado: zonaId != null,
    fn: () => api.posicionesTodosContraTodos(zonaId),
  })

  const apiUrl = configLiga?.apiUrl

  if (zonaId == null) {
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay zona para mostrar posiciones.</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center px-2 py-8">
        <Text className="text-center text-red-600">
          {error?.message ?? 'No se pudieron cargar las posiciones.'}
        </Text>
      </View>
    )
  }

  const categorias = data?.posiciones ?? []

  if (categorias.length === 0) {
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay posiciones para esta zona.</Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator
    >
      {categorias.map((bloque, idx) => (
        <TablaCategoria key={`${bloque.categoria ?? 'cat'}-${idx}`} bloque={bloque} apiUrl={apiUrl} />
      ))}
    </ScrollView>
  )
}
