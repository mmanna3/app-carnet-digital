import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Text, View } from 'react-native'

/** Longitud máxima de un nombre de equipo en tablas de torneo. */
export const MAX_CHARS_NOMBRE_EQUIPO = 16

const TITULO_COLUMNA_EQUIPO = 'Equipo'

/** Padding horizontal total: pl + pr en celdas de la columna Equipo. */
export const PADDING_EQUIPO_ENCABEZADO = 12 // pl-2 (8) + pr-1 (4)
export const PADDING_EQUIPO_CONTENIDO = 10 // pl-1.5 (6) + pr-1 (4)

const ANCHO_CHAR = 9
const PADDING_HORIZONTAL = 16
const ANCHO_MIN_COL = 28

/** Ancho en px según cantidad de caracteres visibles (p. ej. headers cortos). */
export function anchoColumnaPorTexto(texto: string): number {
  const n = texto.trim().length
  return Math.max(ANCHO_MIN_COL, n * ANCHO_CHAR + PADDING_HORIZONTAL)
}

export function nombreMasLargoEquipo(nombres: (string | undefined)[]): string {
  let max = ''
  for (const nombre of nombres) {
    const t = (nombre ?? '').trim()
    if (t.length === 0) continue
    if (t.length > max.length) max = t
  }
  if (max.length === 0) return '—'
  return max.slice(0, MAX_CHARS_NOMBRE_EQUIPO)
}

function estimacionAnchoEquipo(nombres: (string | undefined)[]): number {
  const masLargo = nombreMasLargoEquipo(nombres)
  return Math.max(
    TITULO_COLUMNA_EQUIPO.length * 8 + PADDING_EQUIPO_ENCABEZADO,
    masLargo.length * 7 + PADDING_EQUIPO_CONTENIDO
  )
}

type MedidasEquipo = { encabezado: number; contenido: number }

function anchoDesdeMedidas(m: MedidasEquipo): number {
  return Math.max(m.encabezado + PADDING_EQUIPO_ENCABEZADO, m.contenido + PADDING_EQUIPO_CONTENIDO)
}

type MedidorAnchoEquipoProps = {
  nombres: (string | undefined)[]
  onAncho: (ancho: number) => void
  classNameTextoEncabezado?: string
  classNameTextoContenido?: string
}

const CLASS_ENCABEZADO_DEFAULT = 'text-base font-semibold leading-6'
const CLASS_CONTENIDO_DEFAULT = 'text-base font-medium leading-6'

/** Mide off-screen el header y el nombre más largo para calcular el ancho real de la columna. */
export function MedidorAnchoEquipo({
  nombres,
  onAncho,
  classNameTextoEncabezado = CLASS_ENCABEZADO_DEFAULT,
  classNameTextoContenido = CLASS_CONTENIDO_DEFAULT,
}: MedidorAnchoEquipoProps) {
  const masLargo = useMemo(() => nombreMasLargoEquipo(nombres), [nombres])
  const medidasRef = useRef<MedidasEquipo>({ encabezado: 0, contenido: 0 })
  const onAnchoRef = useRef(onAncho)
  onAnchoRef.current = onAncho

  useEffect(() => {
    medidasRef.current = { encabezado: 0, contenido: 0 }
    onAnchoRef.current(estimacionAnchoEquipo(nombres))
  }, [nombres, masLargo])

  const registrar = useCallback((tipo: keyof MedidasEquipo, anchoTexto: number) => {
    if (anchoTexto <= 0) return
    medidasRef.current = { ...medidasRef.current, [tipo]: anchoTexto }
    const { encabezado, contenido } = medidasRef.current
    if (encabezado > 0 && contenido > 0) {
      onAnchoRef.current(anchoDesdeMedidas({ encabezado, contenido }))
    }
  }, [])

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', opacity: 0, left: -10000, top: 0 }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text
        className={classNameTextoEncabezado}
        onTextLayout={(e) => {
          const w = Math.max(0, ...e.nativeEvent.lines.map((l) => l.width))
          registrar('encabezado', w)
        }}
      >
        {TITULO_COLUMNA_EQUIPO}
      </Text>
      <Text
        className={classNameTextoContenido}
        onTextLayout={(e) => {
          const w = Math.max(0, ...e.nativeEvent.lines.map((l) => l.width))
          registrar('contenido', w)
        }}
      >
        {masLargo}
      </Text>
    </View>
  )
}

export type OpcionesAnchoColumnaEquipo = {
  classNameTextoEncabezado?: string
  classNameTextoContenido?: string
}

/** Ancho medido de la columna Equipo (estimación inicial, luego ajuste fino vía MedidorAnchoEquipo). */
export function useAnchoColumnaEquipo(
  nombres: (string | undefined)[],
  opciones?: OpcionesAnchoColumnaEquipo
) {
  const [anchoEquipo, setAnchoEquipo] = useState(() => estimacionAnchoEquipo(nombres))
  const classNameTextoEncabezado = opciones?.classNameTextoEncabezado ?? CLASS_ENCABEZADO_DEFAULT
  const classNameTextoContenido = opciones?.classNameTextoContenido ?? CLASS_CONTENIDO_DEFAULT

  const medidor = useMemo(
    () => (
      <MedidorAnchoEquipo
        nombres={nombres}
        onAncho={setAnchoEquipo}
        classNameTextoEncabezado={classNameTextoEncabezado}
        classNameTextoContenido={classNameTextoContenido}
      />
    ),
    [nombres, classNameTextoEncabezado, classNameTextoContenido]
  )

  return { anchoEquipo, medidorAnchoEquipo: medidor }
}
