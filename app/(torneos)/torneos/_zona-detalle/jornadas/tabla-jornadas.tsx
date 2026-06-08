import React, { useMemo } from 'react'
import { Platform, Text, View } from 'react-native'
import type { FechasParaJornadasDTO, JornadaPorEquipoDTO } from '@/lib/api/clients'
import { ContenedorTabla, Texto } from '@/design-system/componentes'
import { useAnchoColumnaEquipo } from '@/torneos/_zona-detalle/anchos-tabla'
import { CeldaTabla } from '@/torneos/_zona-detalle/componentes/celda-tabla'
import { EscudoEquipo } from '@/torneos/_zona-detalle/componentes/escudo-equipo'
import { numeroOGuion, textoOGuion } from '@/lib/utilidades/recursos-api'
import {
  ANCHO_JORNADAS,
  anchosColumnasCategorias,
  anchoTablaJornadas,
  celdaResultadoCategoria,
  nombresCategoriasDeFecha,
} from './utilidades-jornadas'

function FilaEncabezadoTablaJornadas({
  nombresCategorias,
  anchosCategorias,
  anchoEquipo,
}: {
  nombresCategorias: string[]
  anchosCategorias: number[]
  anchoEquipo: number
}) {
  return (
    <View className="flex-row rounded-t-2xl border-b border-zinc-700 bg-zinc-900">
      <CeldaTabla ancho={ANCHO_JORNADAS.esc} alinear="center" negrita encabezado borde="inicio">
        Esc
      </CeldaTabla>
      <CeldaTabla ancho={anchoEquipo} alinear="left" negrita encabezado columnaEquipo>
        Equipo
      </CeldaTabla>
      {nombresCategorias.map((cat, i) => (
        <CeldaTabla key={cat} ancho={anchosCategorias[i]} alinear="center" negrita encabezado>
          {cat}
        </CeldaTabla>
      ))}
      <CeldaTabla ancho={ANCHO_JORNADAS.pt} alinear="center" negrita encabezado tabular>
        P.T.
      </CeldaTabla>
      <CeldaTabla ancho={ANCHO_JORNADAS.pj} alinear="center" negrita encabezado tabular borde="fin">
        P.J.
      </CeldaTabla>
    </View>
  )
}

function FilaEquipoTabla({
  equipo,
  nombresCategorias,
  anchosCategorias,
  anchoEquipo,
  lado,
  apiUrl,
  visitanteConMasPartidosDebajo,
}: {
  equipo: JornadaPorEquipoDTO | undefined
  nombresCategorias: string[]
  anchosCategorias: number[]
  anchoEquipo: number
  lado: 'local' | 'visitante'
  apiUrl: string | undefined
  visitanteConMasPartidosDebajo?: boolean
}) {
  const bordeClase =
    lado === 'local'
      ? 'border-b border-gray-100'
      : visitanteConMasPartidosDebajo
        ? 'border-b border-gray-200'
        : 'border-b border-gray-100'

  return (
    <View className={`flex-row ${bordeClase}`}>
      <View style={{ width: ANCHO_JORNADAS.esc, minWidth: ANCHO_JORNADAS.esc }}>
        <EscudoEquipo
          rutaEscudo={equipo?.escudo}
          apiUrl={apiUrl}
          classNameContenedor="shrink-0 items-center justify-center py-1.5 pl-3 pr-1"
        />
      </View>
      <CeldaTabla ancho={anchoEquipo} alinear="left" columnaEquipo>
        {textoOGuion(equipo?.equipo)}
      </CeldaTabla>
      {nombresCategorias.map((cat, i) => (
        <CeldaTabla key={cat} ancho={anchosCategorias[i]} alinear="center" tabular>
          {celdaResultadoCategoria(equipo?.categorias, cat, lado)}
        </CeldaTabla>
      ))}
      <CeldaTabla ancho={ANCHO_JORNADAS.pt} alinear="center" tabular>
        {numeroOGuion(equipo?.puntosTotales)}
      </CeldaTabla>
      <CeldaTabla ancho={ANCHO_JORNADAS.pj} alinear="center" tabular borde="fin">
        {numeroOGuion(equipo?.partidosJugados)}
      </CeldaTabla>
    </View>
  )
}

export function CardFechaJornadas({
  fecha,
  apiUrl,
}: {
  fecha: FechasParaJornadasDTO
  apiUrl: string | undefined
}) {
  const jornadas = fecha.jornadas ?? []
  const nombresCategorias = useMemo(() => nombresCategoriasDeFecha(fecha), [fecha])
  const anchosCategorias = useMemo(
    () => anchosColumnasCategorias(nombresCategorias),
    [nombresCategorias]
  )
  const nombresEquipos = useMemo(
    () => jornadas.flatMap((j) => [j.local?.equipo, j.visitante?.equipo]),
    [jornadas]
  )
  const { anchoEquipo, medidorAnchoEquipo } = useAnchoColumnaEquipo(nombresEquipos)
  const anchoTotal = anchoTablaJornadas(nombresCategorias, anchoEquipo)
  const ultimoIndicePartido = jornadas.length - 1

  return (
    <View className="mb-3">
      {medidorAnchoEquipo}
      <Texto
        variante="titulo"
        className={`mb-1 px-0.5 text-center text-zinc-100 ${Platform.OS === 'web' ? 'text-2xl' : 'text-xl'}`}
        numberOfLines={2}
      >
        {textoOGuion(fecha.titulo)}
      </Texto>
      <Texto className="mb-3 text-center text-md  text-zinc-300" numberOfLines={1}>
        {textoOGuion(fecha.dia)}
      </Texto>
      <ContenedorTabla horizontal={jornadas.length > 0}>
        {jornadas.length === 0 ? (
          <Text className="px-3 py-4 text-sm leading-5 text-gray-600">
            No hay partidos en esta fecha.
          </Text>
        ) : (
          <View style={{ width: anchoTotal, alignSelf: 'flex-start' }}>
            <FilaEncabezadoTablaJornadas
              nombresCategorias={nombresCategorias}
              anchosCategorias={anchosCategorias}
              anchoEquipo={anchoEquipo}
            />
            {jornadas.map((j, i) => {
              const hayMasPartidos = i < ultimoIndicePartido
              return (
                <View key={`${fecha.titulo ?? 'f'}-partido-${i}`}>
                  <FilaEquipoTabla
                    equipo={j.local}
                    nombresCategorias={nombresCategorias}
                    anchosCategorias={anchosCategorias}
                    anchoEquipo={anchoEquipo}
                    lado="local"
                    apiUrl={apiUrl}
                  />
                  <FilaEquipoTabla
                    equipo={j.visitante}
                    nombresCategorias={nombresCategorias}
                    anchosCategorias={anchosCategorias}
                    anchoEquipo={anchoEquipo}
                    lado="visitante"
                    apiUrl={apiUrl}
                    visitanteConMasPartidosDebajo={hayMasPartidos}
                  />
                </View>
              )
            })}
          </View>
        )}
      </ContenedorTabla>
    </View>
  )
}
