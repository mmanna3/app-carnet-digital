import React, { useMemo } from 'react'
import { ActivityIndicator, Image, Platform, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { CategoriasConPosicionesDTO, PosicionDelEquipoDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { usePantallaGrande } from '@/lib/hooks/use-pantalla-grande'

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

/** Anchos mínimos por columna (sin líneas verticales entre columnas). */
const ANCHO = {
  pos: 38,
  esc: 44,
  equipo: 148,
  num: 34,
  goles: 38,
  pts: 40,
} as const

function titulosTabla(mostrarGoles: boolean): string[] {
  const t = ['Pts', 'Pos', 'Esc', 'Equipo', 'J', 'G', 'E', 'P', 'Np']
  if (mostrarGoles) t.push('Gf', 'Gc', 'Df')
  return t
}

function anchoColumna(i: number, mostrarGoles: boolean, numColumnas: number): number {
  if (i === 0) return ANCHO.pts
  if (i === 1) return ANCHO.pos
  if (i === 2) return ANCHO.esc
  if (i === 3) return ANCHO.equipo
  if (mostrarGoles && i >= numColumnas - 3 && i <= numColumnas - 1) return ANCHO.goles
  return ANCHO.num
}

/** Suma exacta de columnas: evita hueco vacío a la derecha al hacer scroll horizontal. */
function anchoTablaTotal(mostrarGoles: boolean): number {
  return (
    ANCHO.pos +
    ANCHO.esc +
    ANCHO.equipo +
    ANCHO.num * 5 +
    (mostrarGoles ? ANCHO.goles * 3 : 0) +
    ANCHO.pts
  )
}

function valorCeldaPosicion(label: string, r: PosicionDelEquipoDTO): string {
  switch (label) {
    case 'Pos':
      return textoOGuion(r.posicion)
    case 'Equipo':
      return textoOGuion(r.equipo)
    case 'J':
      return textoOGuion(r.partidosJugados)
    case 'G':
      return textoOGuion(r.partidosGanados)
    case 'E':
      return textoOGuion(r.partidosEmpatados)
    case 'P':
      return textoOGuion(r.partidosPerdidos)
    case 'Np':
      return textoOGuion(r.partidosNoPresento)
    case 'Gf':
      return textoOGuion(r.golesAFavor)
    case 'Gc':
      return textoOGuion(r.golesEnContra)
    case 'Df':
      return textoOGuion(r.golesDiferencia)
    case 'Pts':
      return textoOGuion(r.puntos)
    default:
      return '—'
  }
}

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

function FilaEncabezado({ mostrarGoles }: { mostrarGoles: boolean }) {
  const titulos = titulosTabla(mostrarGoles)
  const n = titulos.length
  return (
    <View className="flex-row border-b border-gray-300 bg-gray-100">
      {titulos.map((h, i) => (
        <Celda
          key={h}
          ancho={anchoColumna(i, mostrarGoles, n)}
          alinear={i === 0 ? 'center' : i >= 1 && i <= 3 ? 'left' : 'center'}
          negrita
          tabular={i === 0 || i >= 4}
        >
          {h}
        </Celda>
      ))}
    </View>
  )
}

function FilaEquipo({
  r,
  apiUrl,
  mostrarGoles,
}: {
  r: PosicionDelEquipoDTO
  apiUrl: string | undefined
  mostrarGoles: boolean
}) {
  const uri = uriRecursoPublicoApi(apiUrl, r.escudo)
  const titulos = titulosTabla(mostrarGoles)
  const n = titulos.length

  return (
    <View className="flex-row border-b border-gray-100">
      {titulos.map((label, i) => {
        const ancho = anchoColumna(i, mostrarGoles, n)
        if (label === 'Esc') {
          return (
            <View
              key="esc"
              style={{ width: ancho, minWidth: ancho }}
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
        const alinear: 'left' | 'center' = label === 'Equipo' ? 'left' : 'center'
        return (
          <Celda key={label} ancho={ancho} alinear={alinear} tabular={label !== 'Equipo'}>
            {valorCeldaPosicion(label, r)}
          </Celda>
        )
      })}
    </View>
  )
}

function LeyendaDebajoTabla({
  texto,
  anchoTabla,
}: {
  texto: string | undefined
  anchoTabla: number
}) {
  const t = (texto ?? '').trim()
  if (!t) return null
  const cuerpo = <Text className="px-0.5 text-sm leading-5 text-gray-600">{t}</Text>
  if (Platform.OS !== 'web') {
    return <View className="mt-2">{cuerpo}</View>
  }
  return (
    <View className="mt-2" style={{ maxWidth: anchoTabla, alignSelf: 'flex-start' }}>
      {cuerpo}
    </View>
  )
}

function TablaCategoria({
  bloque,
  apiUrl,
  mostrarGoles,
}: {
  bloque: CategoriasConPosicionesDTO
  apiUrl: string | undefined
  mostrarGoles: boolean
}) {
  const renglones = bloque.renglones ?? []
  const anchoTotal = anchoTablaTotal(mostrarGoles)
  return (
    <View className="mb-5">
      <Text className="mb-2 px-0.5 text-base font-semibold text-gray-900" numberOfLines={2}>
        {textoOGuion(bloque.categoria)}
      </Text>
      {renglones.length === 0 ? (
        <Text className="px-0.5 text-sm leading-5 text-gray-600">
          Aún no hay partidos en esta categoría
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
          <View style={{ width: anchoTotal, alignSelf: 'flex-start' }}>
            <FilaEncabezado mostrarGoles={mostrarGoles} />
            {renglones.map((r, i) => (
              <FilaEquipo
                key={`${r.equipo ?? 'eq'}-${i}`}
                r={r}
                apiUrl={apiUrl}
                mostrarGoles={mostrarGoles}
              />
            ))}
          </View>
        </ScrollView>
      )}
      <LeyendaDebajoTabla texto={bloque.leyenda} anchoTabla={anchoTotal} />
    </View>
  )
}

export default function Posiciones() {
  const configLiga = useConfigLiga()
  const grande = usePantallaGrande()
  const { zonaId: zonaIdParam, tipoDeFase: tipoDeFaseParam } = useLocalSearchParams<{
    zonaId?: string
    tipoDeFase?: string
  }>()
  const esAnual = (tipoDeFaseParam != null ? String(tipoDeFaseParam) : '') === 'Anual'

  const zonaId = useMemo(() => {
    if (zonaIdParam == null || zonaIdParam === '') return undefined
    const n = Number(zonaIdParam)
    return Number.isFinite(n) ? n : undefined
  }, [zonaIdParam])

  const { data, isLoading, isError, error } = useApiQuery({
    key: esAnual ? queryKeys.zonas.posicionesAnual(zonaId) : queryKeys.zonas.posiciones(zonaId),
    activado: zonaId != null,
    fn: () => (esAnual ? api.posicionesAnual(zonaId) : api.posicionesTodosContraTodos(zonaId)),
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
  const mostrarGoles = data?.verGoles !== false

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
      contentContainerStyle={{
        paddingBottom: 24,
        alignItems: grande ? 'center' : 'stretch',
      }}
      showsVerticalScrollIndicator
    >
      {categorias.map((bloque, idx) => (
        <TablaCategoria
          key={`${bloque.categoria ?? 'cat'}-${idx}`}
          bloque={bloque}
          apiUrl={apiUrl}
          mostrarGoles={mostrarGoles}
        />
      ))}
    </ScrollView>
  )
}
