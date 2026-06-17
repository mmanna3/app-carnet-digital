import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { InformacionInicialElementoTorneoDTO } from '@/lib/api/clients'
import { getTemaAgrupador } from '@/lib/design-system'
import { Texto } from '@/design-system/componentes'
import { TarjetaTorneo } from '@/torneos/_components/tarjeta-torneo'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

type NavegarZona = (params: {
  torneoId: string
  zonaId: string
  zonaNombre: string
  faseNombre: string
  tipoDeFase: string
  grupoNombre?: string
}) => void

interface SeccionGrupoFasesProps {
  nombreGrupo: string
  elementos: InformacionInicialElementoTorneoDTO[]
  torneoId: number | undefined
  torneoNombre: string
  color?: string
  grande: boolean
  onNavegarZona: NavegarZona
}

interface SeccionElementoTorneoProps {
  elemento: InformacionInicialElementoTorneoDTO
  torneoId: number | undefined
  torneoNombre: string
  color?: string
  grande: boolean
  onNavegarZona: NavegarZona
  /** Hijo directo de un grupo de fases raíz (fase o subgrupo: estilo liviano, sin caja). */
  hijoDirectoDeGrupo?: boolean
  /** Hijo de un subgrupo (fase: caja sutil, título chico sin ícono). */
  hijoDeSubgrupo?: boolean
}

function TituloHijoGrupo({ titulo }: { titulo: string }) {
  return (
    <Texto variante="eyebrow" className="mb-2 text-zinc-100">
      {titulo}
    </Texto>
  )
}

function EncabezadoBloque({
  titulo,
  color,
  iconName,
}: {
  titulo: string
  color?: string
  iconName: IoniconsName
}) {
  const tema = getTemaAgrupador(color)

  return (
    <View className="mb-3 flex-row items-center gap-2.5 border-b border-white/10 pb-3">
      <View
        className={`h-8 w-8 items-center justify-center rounded-lg border ${tema.border} ${tema.iconBg}`}
      >
        <Ionicons name={iconName} size={18} color={tema.iconColor} />
      </View>
      <Texto variante="titulo" className="flex-1 text-base leading-5">
        {titulo}
      </Texto>
    </View>
  )
}

function ContenedorFaseSubgrupo({
  titulo,
  color,
  children,
}: {
  titulo: string
  color?: string
  children: React.ReactNode
}) {
  const tema = getTemaAgrupador(color)

  return (
    <View className={`mb-4 overflow-hidden rounded-2xl border ${tema.border} bg-white/[0.03] p-3`}>
      {titulo ? (
        <Texto variante="eyebrow" className="mb-2 normal-case tracking-wide text-zinc-400">
          {titulo}
        </Texto>
      ) : null}
      {children}
    </View>
  )
}

function GrillaZonas({
  elemento,
  torneoId,
  color,
  grande,
  faseNombre,
  tipoDeFase,
  onNavegarZona,
}: {
  elemento: InformacionInicialElementoTorneoDTO
  torneoId: number | undefined
  color?: string
  grande: boolean
  faseNombre: string
  tipoDeFase: string
  onNavegarZona: NavegarZona
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
    hijoDirectoDeGrupo = false,
    hijoDeSubgrupo = false,
  } = props
  const faseNombre = elemento.nombre ?? ''
  const tipoDeFase = elemento.tipoDeFase ?? ''

  const grilla = (
    <GrillaZonas
      elemento={elemento}
      torneoId={torneoId}
      color={color}
      grande={grande}
      faseNombre={faseNombre}
      tipoDeFase={tipoDeFase}
      onNavegarZona={onNavegarZona}
    />
  )

  if (hijoDeSubgrupo) {
    return (
      <ContenedorFaseSubgrupo titulo={faseNombre.trim() || 'Fase'} color={color}>
        {grilla}
      </ContenedorFaseSubgrupo>
    )
  }

  if (hijoDirectoDeGrupo) {
    return (
      <View className="mb-4">
        {faseNombre ? <TituloHijoGrupo titulo={faseNombre} /> : null}
        {grilla}
      </View>
    )
  }

  return (
    <View className="mb-6">
      {faseNombre ? (
        <Texto
          variante="eyebrow"
          className="mb-3 text-base text-zinc-300 normal-case tracking-wide"
        >
          {faseNombre}
        </Texto>
      ) : null}
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

  return (
    <View className="mb-4">
      <TituloHijoGrupo titulo={nombreGrupo} />
      {elementos.map((el, i) => (
        <SeccionElementoTorneo
          key={el.tipo === 'grupo' ? `grupo-${el.grupoId ?? i}` : `fase-${el.id ?? i}`}
          elemento={el}
          torneoId={props.torneoId}
          torneoNombre={props.torneoNombre}
          color={props.color}
          grande={props.grande}
          onNavegarZona={props.onNavegarZona}
          hijoDeSubgrupo
        />
      ))}
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
  hijoDirectoDeGrupo = false,
  hijoDeSubgrupo = false,
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
        hijoDirectoDeGrupo,
        hijoDeSubgrupo,
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
      />
    )
  }

  return renderZonasDeFase(elemento, {
    torneoId,
    torneoNombre,
    color,
    grande,
    onNavegarZona,
    hijoDirectoDeGrupo,
    hijoDeSubgrupo,
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
}: SeccionGrupoFasesProps) {
  const tema = getTemaAgrupador(color)

  return (
    <View className="mb-8">
      <View className={`overflow-hidden rounded-2xl border ${tema.border} bg-white/5 p-4`}>
        <EncabezadoBloque titulo={nombreGrupo} color={color} iconName="layers-outline" />

        {elementos.map((el, i) => (
          <SeccionElementoTorneo
            key={el.tipo === 'grupo' ? `grupo-${el.grupoId ?? i}` : `fase-${el.id ?? i}`}
            elemento={el}
            torneoId={torneoId}
            torneoNombre={torneoNombre}
            color={color}
            grande={grande}
            onNavegarZona={onNavegarZona}
            hijoDirectoDeGrupo
          />
        ))}
      </View>
    </View>
  )
}

export type { NavegarZona }
