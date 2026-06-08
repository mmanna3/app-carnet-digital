import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { hexIconoAgrupador } from '@/lib/design-system'
import { BarraTabsInferior, TAB_ICON_SIZE } from '@/design-system/componentes/barra-tabs-inferior'
import Clubes from '@/torneos/_zona-detalle/clubes'
import FixtureEliminacionDirecta from '@/torneos/_zona-detalle/fixture-eliminacion-directa'
import FixtureTodosContraTodos from '@/torneos/_zona-detalle/fixture-todos-contra-todos'
import Jornadas from '@/torneos/_zona-detalle/jornadas'
import Posiciones from '@/torneos/_zona-detalle/posiciones'
import { ResumenTorneo } from '@/torneos/_zona-detalle/resumen-torneo'
import { useHeaderConHome } from '@/torneos/_components/cabecera-publica'
import { usePantallaGrande } from '@/lib/hooks/use-pantalla-grande'

type IconName = ComponentProps<typeof Ionicons>['name']

type TabDef = { titulo: string; icon: IconName; Contenido: React.ComponentType }

export default function ZonaDetalle() {
  const { zonaId: zonaIdParam, tipoDeFase: tipoDeFaseParam } = useLocalSearchParams<{
    zonaId?: string
    tipoDeFase?: string
  }>()
  const scopeKey = `${zonaIdParam ?? ''}-${tipoDeFaseParam ?? ''}`
  return <ZonaDetalleContenido key={scopeKey} />
}

function ZonaDetalleContenido() {
  const grande = usePantallaGrande()
  const [tabIndex, setTabIndex] = useState(0)

  const {
    color,
    torneoNombre,
    faseNombre,
    zonaNombre,
    tipoDeFase: tipoDeFaseParam,
  } = useLocalSearchParams<{
    zonaNombre?: string
    color?: string
    torneoNombre?: string
    faseNombre?: string
    zonaId?: string
    tipoDeFase?: string
  }>()

  const tipoDeFase = tipoDeFaseParam != null ? String(tipoDeFaseParam) : ''
  const esEliminacionDirecta = tipoDeFase === 'EliminacionDirecta'
  const esAnual = tipoDeFase === 'Anual'

  const TABS: TabDef[] = useMemo(() => {
    if (esEliminacionDirecta) {
      return [
        { titulo: 'Fixture', icon: 'calendar-outline', Contenido: FixtureEliminacionDirecta },
        { titulo: 'Clubes', icon: 'shield-half-outline', Contenido: Clubes },
      ]
    }
    if (esAnual) {
      return [{ titulo: 'Posiciones', icon: 'trophy-outline', Contenido: Posiciones }]
    }
    return [
      { titulo: 'Posiciones', icon: 'trophy-outline', Contenido: Posiciones },
      { titulo: 'Fixture', icon: 'calendar-outline', Contenido: FixtureTodosContraTodos },
      { titulo: 'Jornadas', icon: 'football-outline', Contenido: Jornadas },
      { titulo: 'Clubes', icon: 'shield-half-outline', Contenido: Clubes },
    ]
  }, [esEliminacionDirecta, esAnual])

  const colorAgrupador = color != null && String(color).length > 0 ? String(color) : undefined

  const tituloHeader = TABS[tabIndex]?.titulo ?? 'Zona'

  const hexAcento = hexIconoAgrupador(colorAgrupador)

  useHeaderConHome({ titulo: tituloHeader })

  const Contenido = TABS[tabIndex]?.Contenido ?? Posiciones

  const textoTorneo = torneoNombre != null ? String(torneoNombre) : ''
  const textoFase = faseNombre != null ? String(faseNombre) : ''
  const textoZona = zonaNombre != null ? String(zonaNombre) : ''

  return (
    <View className="flex-1 bg-surface">
      <View
        className="flex-1 px-4 pt-6"
        style={{ maxWidth: 1280, marginHorizontal: 'auto', width: '100%' }}
      >
        <ResumenTorneo
          torneo={textoTorneo}
          fase={textoFase}
          zona={textoZona}
          colorAgrupador={colorAgrupador}
        />
        <View className={`flex-1${grande ? ' px-24' : ''}`}>
          <Contenido />
        </View>
      </View>

      <BarraTabsInferior
        hexAcento={hexAcento}
        indiceActivo={tabIndex}
        tabs={TABS.map((t, i) => ({
          key: t.titulo,
          titulo: t.titulo,
          renderIcono: (color) => <Ionicons name={t.icon} size={TAB_ICON_SIZE} color={color} />,
          onPress: () => setTabIndex(i),
        }))}
      />
    </View>
  )
}
