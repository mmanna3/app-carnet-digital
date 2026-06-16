import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { InformacionInicialElementoTorneoDTO } from '@/lib/api/clients'
import { getTemaAgrupador } from '@/lib/design-system'
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
  dentroDeGrupo?: boolean
}

function renderZonasDeFase(
  elemento: InformacionInicialElementoTorneoDTO,
  props: Omit<SeccionElementoTorneoProps, 'elemento' | 'profundidadGrupo'>
) {
  const { torneoId, torneoNombre, color, grande, onNavegarZona, dentroDeGrupo = false } = props
  const faseNombre = elemento.nombre ?? ''
  const tipoDeFase = elemento.tipoDeFase ?? ''

  return (
    <View className={dentroDeGrupo ? 'mb-4' : 'mb-6'}>
      {faseNombre ? (
        dentroDeGrupo ? (
          <Texto variante="eyebrow" className="mb-2 text-zinc-100">
            {faseNombre}
          </Texto>
        ) : (
          <Texto
            variante="eyebrow"
            className="mb-3 text-base text-zinc-300 normal-case tracking-wide"
          >
            {faseNombre}
          </Texto>
        )
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
  dentroDeGrupo = false,
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
    dentroDeGrupo,
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
  const tema = getTemaAgrupador(color)
  const esAnidado = profundidad > 1
  const esRaiz = profundidad === 1

  return (
    <View className={esRaiz ? 'mb-8' : 'mb-3'}>
      <View
        className={`overflow-hidden rounded-2xl border ${tema.border} p-4 ${esAnidado ? 'bg-white/[0.03]' : 'bg-white/5'}`}
        style={esAnidado ? { borderLeftWidth: 3, borderLeftColor: tema.iconColor } : undefined}
      >
        <View className="mb-4 flex-row items-center gap-2.5 border-b border-white/10 pb-3">
          <View
            className={`h-8 w-8 items-center justify-center rounded-lg border ${tema.border} ${tema.iconBg}`}
          >
            <Ionicons name="layers-outline" size={18} color={tema.iconColor} />
          </View>
          <Texto variante="titulo" className="flex-1 text-base leading-5">
            {nombreGrupo}
          </Texto>
        </View>

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
            dentroDeGrupo
          />
        ))}
      </View>
    </View>
  )
}

export type { NavegarZona }
