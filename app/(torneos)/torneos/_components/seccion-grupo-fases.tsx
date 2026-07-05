import React, { useState } from 'react'
import { View } from 'react-native'
import type { InformacionInicialElementoTorneoDTO } from '@/lib/api/clients'
import { getTemaAgrupador } from '@/lib/design-system'
import { TarjetaTorneo } from '@/torneos/_components/tarjeta-torneo'
import { EncabezadoDesplegable } from '@/torneos/_components/encabezado-desplegable'

type NavegarZona = (params: {
  torneoId: string
  zonaId: string
  zonaNombre: string
  faseNombre: string
  tipoDeFase: string
  grupoDeFasesNombre?: string
  subgrupoNombre?: string
}) => void

interface ContextoJerarquia {
  nombreGrupoDeFases?: string
  nombreSubgrupo?: string
}

interface PropsCompartidos extends ContextoJerarquia {
  torneoId: number | undefined
  torneoNombre: string
  color?: string
  grande: boolean
  onNavegarZona: NavegarZona
}

interface SeccionGrupoFasesProps extends PropsCompartidos {
  nombreGrupo: string
  elementos: InformacionInicialElementoTorneoDTO[]
  expandido: boolean
  onToggle: () => void
  expandidoInicialHabilitado?: boolean
}

interface SeccionElementoTorneoProps extends PropsCompartidos {
  elemento: InformacionInicialElementoTorneoDTO
  expandido: boolean
  onToggle: () => void
  /** Hijo directo de un grupo de fases raíz (fase o subgrupo: estilo liviano, sin caja). */
  hijoDirectoDeGrupo?: boolean
  /** Hijo de un subgrupo (fase: caja sutil, título chico sin ícono). */
  hijoDeSubgrupo?: boolean
  nivelIndentacion?: number
  esRaiz?: boolean
  expandidoInicialHabilitado?: boolean
}

interface ListaElementosTorneoProps extends PropsCompartidos {
  elementos: InformacionInicialElementoTorneoDTO[]
  hijoDirectoDeGrupo?: boolean
  hijoDeSubgrupo?: boolean
  nivelIndentacion?: number
  /** Hijos directos del torneo: misma estética liviana para fases y grupos. */
  esRaiz?: boolean
  /** Si el torneo tiene una sola fase, expandir el único camino al entrar. */
  expandidoInicialHabilitado?: boolean
}

function claveElemento(el: InformacionInicialElementoTorneoDTO, i: number): string {
  return (el.tipo ?? 'fase').toLowerCase() === 'grupo'
    ? `grupo-${el.grupoId ?? i}`
    : `fase-${el.id ?? i}`
}

function contarFases(elementos: InformacionInicialElementoTorneoDTO[]): number {
  return elementos.reduce((acc, el) => {
    const tipo = (el.tipo ?? 'fase').toLowerCase()
    if (tipo === 'fase') return acc + 1
    return acc + contarFases(el.elementos ?? [])
  }, 0)
}

function claveExpandidaInicial(
  elementos: InformacionInicialElementoTorneoDTO[],
  habilitado: boolean
): string | null {
  if (!habilitado || elementos.length !== 1) return null
  return claveElemento(elementos[0], 0)
}

function GrillaZonas({
  elemento,
  torneoId,
  color,
  grande,
  faseNombre,
  tipoDeFase,
  onNavegarZona,
  nombreGrupoDeFases,
  nombreSubgrupo,
}: {
  elemento: InformacionInicialElementoTorneoDTO
  torneoId: number | undefined
  color?: string
  grande: boolean
  faseNombre: string
  tipoDeFase: string
  onNavegarZona: NavegarZona
  nombreGrupoDeFases?: string
  nombreSubgrupo?: string
}) {
  return (
    <View style={grande ? { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } : undefined}>
      {(elemento.zonas ?? []).map((zona) => (
        <View
          key={zona.id ?? zona.nombre}
          style={grande ? { flex: 1, minWidth: '30%', maxWidth: '33.33%' } : undefined}
        >
          <TarjetaTorneo
            nombre={zona.nombre?.trim() || 'Sin nombre'}
            color={color}
            iconName="map"
            onPress={() =>
              onNavegarZona({
                torneoId: String(torneoId ?? ''),
                zonaId: zona.id != null ? String(zona.id) : '',
                zonaNombre: zona.nombre ?? '',
                faseNombre,
                tipoDeFase,
                grupoDeFasesNombre: nombreGrupoDeFases,
                subgrupoNombre: nombreSubgrupo,
              })
            }
          />
        </View>
      ))}
    </View>
  )
}

function renderZonasDeFase(
  elemento: InformacionInicialElementoTorneoDTO,
  props: Omit<SeccionElementoTorneoProps, 'elemento'>
) {
  const {
    torneoId,
    color,
    grande,
    onNavegarZona,
    expandido,
    onToggle,
    hijoDeSubgrupo = false,
    esRaiz = false,
    nivelIndentacion = 0,
    nombreGrupoDeFases,
    nombreSubgrupo,
  } = props
  const faseNombre = elemento.nombre?.trim() || 'Fase'
  const tipoDeFase = elemento.tipoDeFase ?? ''
  const tema = getTemaAgrupador(color)

  const grilla = expandido ? (
    <GrillaZonas
      elemento={elemento}
      torneoId={torneoId}
      color={color}
      grande={grande}
      faseNombre={faseNombre}
      tipoDeFase={tipoDeFase}
      onNavegarZona={onNavegarZona}
      nombreGrupoDeFases={nombreGrupoDeFases}
      nombreSubgrupo={nombreSubgrupo}
    />
  ) : null

  const encabezado = (
    <EncabezadoDesplegable
      titulo={faseNombre}
      expandido={expandido}
      onToggle={onToggle}
      color={color}
      variante="fase"
      testID={`desplegable-${faseNombre}`}
      nivelIndentacion={nivelIndentacion}
    />
  )

  if (hijoDeSubgrupo) {
    return (
      <View
        className={`mb-4 overflow-hidden rounded-2xl border ${tema.border} bg-white/[0.03] p-3`}
      >
        {encabezado}
        {grilla}
      </View>
    )
  }

  return (
    <View className={esRaiz ? 'mb-6' : 'mb-4'}>
      {encabezado}
      {grilla}
    </View>
  )
}

function renderSubgrupo(
  elemento: InformacionInicialElementoTorneoDTO,
  props: SeccionElementoTorneoProps
) {
  const nombreGrupo = elemento.nombreGrupo ?? elemento.nombre ?? 'Grupo'
  const elementos = elemento.elementos ?? []
  const { expandido, onToggle, nivelIndentacion = 0 } = props

  return (
    <View className="mb-4">
      <EncabezadoDesplegable
        titulo={nombreGrupo}
        expandido={expandido}
        onToggle={onToggle}
        color={props.color}
        variante="subgrupo"
        testID={`desplegable-${nombreGrupo}`}
        nivelIndentacion={nivelIndentacion}
      />
      {expandido ? (
        <ListaElementosTorneo
          elementos={elementos}
          torneoId={props.torneoId}
          torneoNombre={props.torneoNombre}
          color={props.color}
          grande={props.grande}
          onNavegarZona={props.onNavegarZona}
          hijoDeSubgrupo
          nivelIndentacion={nivelIndentacion + 1}
          expandidoInicialHabilitado={props.expandidoInicialHabilitado}
          nombreGrupoDeFases={props.nombreGrupoDeFases}
          nombreSubgrupo={nombreGrupo}
        />
      ) : null}
    </View>
  )
}

export function SeccionElementoTorneo({
  elemento,
  torneoId,
  torneoNombre,
  color,
  grande,
  onNavegarZona,
  expandido,
  onToggle,
  hijoDirectoDeGrupo = false,
  hijoDeSubgrupo = false,
  nivelIndentacion = 0,
  esRaiz = false,
  expandidoInicialHabilitado = false,
  nombreGrupoDeFases,
  nombreSubgrupo,
}: SeccionElementoTorneoProps) {
  const tipo = (elemento.tipo ?? 'fase').toLowerCase()

  if (tipo === 'grupo') {
    if (hijoDirectoDeGrupo) {
      return renderSubgrupo(elemento, {
        elemento,
        torneoId,
        torneoNombre,
        color,
        grande,
        onNavegarZona,
        expandido,
        onToggle,
        hijoDirectoDeGrupo,
        hijoDeSubgrupo,
        nivelIndentacion,
        esRaiz,
        expandidoInicialHabilitado,
        nombreGrupoDeFases,
        nombreSubgrupo,
      })
    }

    return (
      <SeccionGrupoFases
        nombreGrupo={elemento.nombreGrupo ?? elemento.nombre ?? 'Grupo'}
        elementos={elemento.elementos ?? []}
        torneoId={torneoId}
        torneoNombre={torneoNombre}
        color={color}
        grande={grande}
        onNavegarZona={onNavegarZona}
        expandido={expandido}
        onToggle={onToggle}
        expandidoInicialHabilitado={expandidoInicialHabilitado}
      />
    )
  }

  return renderZonasDeFase(elemento, {
    torneoId,
    torneoNombre,
    color,
    grande,
    onNavegarZona,
    expandido,
    onToggle,
    hijoDirectoDeGrupo,
    hijoDeSubgrupo,
    nivelIndentacion,
    esRaiz,
    nombreGrupoDeFases,
    nombreSubgrupo,
  })
}

export function SeccionGrupoFases({
  nombreGrupo,
  elementos,
  torneoId,
  torneoNombre,
  color,
  grande,
  onNavegarZona,
  expandido,
  onToggle,
  expandidoInicialHabilitado = false,
}: SeccionGrupoFasesProps) {
  return (
    <View className="mb-6">
      <EncabezadoDesplegable
        titulo={nombreGrupo}
        expandido={expandido}
        onToggle={onToggle}
        color={color}
        variante="fase"
        testID={`desplegable-${nombreGrupo}`}
      />
      {expandido ? (
        <ListaElementosTorneo
          elementos={elementos}
          torneoId={torneoId}
          torneoNombre={torneoNombre}
          color={color}
          grande={grande}
          onNavegarZona={onNavegarZona}
          hijoDirectoDeGrupo
          nivelIndentacion={1}
          expandidoInicialHabilitado={expandidoInicialHabilitado}
          nombreGrupoDeFases={nombreGrupo}
        />
      ) : null}
    </View>
  )
}

export function ListaElementosTorneo({
  elementos,
  torneoId,
  torneoNombre,
  color,
  grande,
  onNavegarZona,
  hijoDirectoDeGrupo = false,
  hijoDeSubgrupo = false,
  nivelIndentacion = 0,
  esRaiz = false,
  expandidoInicialHabilitado = false,
  nombreGrupoDeFases,
  nombreSubgrupo,
}: ListaElementosTorneoProps) {
  const [expandidoKey, setExpandidoKey] = useState<string | null>(() =>
    claveExpandidaInicial(elementos, expandidoInicialHabilitado)
  )

  const toggle = (key: string) => {
    setExpandidoKey((prev) => (prev === key ? null : key))
  }

  return (
    <>
      {elementos.map((el, i) => {
        const key = claveElemento(el, i)
        return (
          <SeccionElementoTorneo
            key={key}
            elemento={el}
            torneoId={torneoId}
            torneoNombre={torneoNombre}
            color={color}
            grande={grande}
            onNavegarZona={onNavegarZona}
            expandido={expandidoKey === key}
            onToggle={() => toggle(key)}
            hijoDirectoDeGrupo={hijoDirectoDeGrupo}
            hijoDeSubgrupo={hijoDeSubgrupo}
            nivelIndentacion={nivelIndentacion}
            esRaiz={esRaiz}
            expandidoInicialHabilitado={expandidoInicialHabilitado}
            nombreGrupoDeFases={nombreGrupoDeFases}
            nombreSubgrupo={nombreSubgrupo}
          />
        )
      })}
    </>
  )
}

export type { NavegarZona }
export { contarFases }
