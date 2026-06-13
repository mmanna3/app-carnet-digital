import React from 'react'
import { View } from 'react-native'
import type { InformacionInicialElementoTorneoDTO } from '@/lib/api/clients'
import { Texto } from '@/design-system/componentes'
import { TarjetaTorneo } from '@/torneos/_components/tarjeta-torneo'

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
  profundidad?: number
}

interface SeccionElementoTorneoProps {
  elemento: InformacionInicialElementoTorneoDTO
  torneoId: number | undefined
  torneoNombre: string
  color?: string
  grande: boolean
  onNavegarZona: NavegarZona
  profundidadGrupo?: number
}

function renderZonasDeFase(
  elemento: InformacionInicialElementoTorneoDTO,
  props: Omit<SeccionElementoTorneoProps, 'elemento' | 'profundidadGrupo'>
) {
  const { torneoId, torneoNombre, color, grande, onNavegarZona } = props
  const faseNombre = elemento.nombre ?? ''
  const tipoDeFase = elemento.tipoDeFase ?? ''

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
  profundidadGrupo = 0,
}: SeccionElementoTorneoProps) {
  const tipo = (elemento.tipo ?? 'fase').toLowerCase()

  if (tipo === 'grupo') {
    return (
      <SeccionGrupoFases
        nombreGrupo={elemento.nombreGrupo ?? elemento.nombre ?? 'Grupo'}
        elementos={elemento.elementos ?? []}
        torneoId={torneoId}
        torneoNombre={torneoNombre}
        color={color}
        grande={grande}
        onNavegarZona={onNavegarZona}
        profundidad={profundidadGrupo + 1}
      />
    )
  }

  return renderZonasDeFase(elemento, {
    torneoId,
    torneoNombre,
    color,
    grande,
    onNavegarZona,
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
  profundidad = 1,
}: SeccionGrupoFasesProps) {
  const indent =
    profundidad > 1
      ? { marginLeft: 12, borderLeftWidth: 1, borderLeftColor: '#3f3f46', paddingLeft: 12 }
      : undefined

  return (
    <View className="mb-6" style={indent}>
      <Texto variante="eyebrow" className="mb-3 text-base text-zinc-400 normal-case tracking-wide">
        {nombreGrupo}
      </Texto>
      {elementos.map((el, i) => (
        <SeccionElementoTorneo
          key={el.tipo === 'grupo' ? `grupo-${el.grupoId ?? i}` : `fase-${el.id ?? i}`}
          elemento={el}
          torneoId={torneoId}
          torneoNombre={torneoNombre}
          color={color}
          grande={grande}
          onNavegarZona={onNavegarZona}
          profundidadGrupo={profundidad}
        />
      ))}
    </View>
  )
}

export type { NavegarZona }
