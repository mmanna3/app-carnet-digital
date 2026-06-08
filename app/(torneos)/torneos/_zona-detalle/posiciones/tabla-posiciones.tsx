import React from 'react'
import { Platform, Text, View } from 'react-native'
import type { CategoriasConPosicionesDTO, PosicionDelEquipoDTO } from '@/lib/api/clients'
import { ContenedorTabla, Texto } from '@/design-system/componentes'
import { useAnchoColumnaEquipo } from '@/torneos/_zona-detalle/anchos-tabla'
import { CeldaTabla } from '@/torneos/_zona-detalle/componentes/celda-tabla'
import { EscudoEquipo } from '@/torneos/_zona-detalle/componentes/escudo-equipo'
import { textoOGuion } from '@/lib/utilidades/recursos-api'
import {
  anchoColumna,
  anchoTablaTotal,
  titulosTabla,
  valorCeldaPosicion,
} from './utilidades-posiciones'

function FilaEncabezado({
  mostrarGoles,
  anchoEquipo,
}: {
  mostrarGoles: boolean
  anchoEquipo: number
}) {
  const titulos = titulosTabla(mostrarGoles)
  const n = titulos.length
  return (
    <View className="flex-row rounded-t-2xl border-b border-zinc-700 bg-zinc-900">
      {titulos.map((h, i) => (
        <CeldaTabla
          key={h}
          ancho={anchoColumna(i, mostrarGoles, n, anchoEquipo)}
          alinear={i <= 2 ? 'left' : 'center'}
          negrita
          encabezado
          tabular={i === 3 || i >= 4}
          columnaEquipo={h === 'Equipo'}
        >
          {h}
        </CeldaTabla>
      ))}
    </View>
  )
}

function FilaEquipo({
  r,
  apiUrl,
  mostrarGoles,
  anchoEquipo,
}: {
  r: PosicionDelEquipoDTO
  apiUrl: string | undefined
  mostrarGoles: boolean
  anchoEquipo: number
}) {
  const titulos = titulosTabla(mostrarGoles)
  const n = titulos.length

  return (
    <View className="flex-row border-b border-gray-100">
      {titulos.map((label, i) => {
        const ancho = anchoColumna(i, mostrarGoles, n, anchoEquipo)
        if (label === 'Esc') {
          return (
            <View key="esc" style={{ width: ancho, minWidth: ancho }}>
              <EscudoEquipo rutaEscudo={r.escudo} apiUrl={apiUrl} />
            </View>
          )
        }
        const alinear: 'left' | 'center' = label === 'Equipo' ? 'left' : 'center'
        return (
          <CeldaTabla
            key={label}
            ancho={ancho}
            alinear={alinear}
            tabular={label !== 'Equipo'}
            columnaEquipo={label === 'Equipo'}
          >
            {valorCeldaPosicion(label, r)}
          </CeldaTabla>
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

export function TablaCategoria({
  bloque,
  apiUrl,
  mostrarGoles,
}: {
  bloque: CategoriasConPosicionesDTO
  apiUrl: string | undefined
  mostrarGoles: boolean
}) {
  const renglones = bloque.renglones ?? []
  const { anchoEquipo, medidorAnchoEquipo } = useAnchoColumnaEquipo(renglones.map((r) => r.equipo))
  const anchoTotal = anchoTablaTotal(mostrarGoles, anchoEquipo)
  return (
    <View className="my-5">
      {medidorAnchoEquipo}
      <Texto
        variante="titulo"
        className={`mb-3 px-0.5 text-center text-zinc-100 ${Platform.OS === 'web' ? 'text-2xl' : 'text-xl'}`}
        numberOfLines={2}
      >
        {textoOGuion(bloque.categoria)}
      </Texto>
      {renglones.length === 0 ? (
        <Texto variante="caption" className="px-0.5 text-zinc-600">
          Aún no hay partidos en esta categoría
        </Texto>
      ) : (
        <ContenedorTabla horizontal>
          <View style={{ width: anchoTotal, alignSelf: 'flex-start' }}>
            <FilaEncabezado mostrarGoles={mostrarGoles} anchoEquipo={anchoEquipo} />
            {renglones.map((r, i) => (
              <FilaEquipo
                key={`${r.equipo ?? 'eq'}-${i}`}
                r={r}
                apiUrl={apiUrl}
                mostrarGoles={mostrarGoles}
                anchoEquipo={anchoEquipo}
              />
            ))}
          </View>
        </ContenedorTabla>
      )}
      <LeyendaDebajoTabla texto={bloque.leyenda} anchoTabla={anchoTotal} />
    </View>
  )
}
