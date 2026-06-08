import React from 'react'
import { View, type LayoutChangeEvent } from 'react-native'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import Carnet from '@/delegados/_components/mis-jugadores/carnet'
import { FranjaSeccion, type TemaFranja } from '@/design-system/componentes'

type ListaCarnetsEquipoProps = {
  delegados: CarnetDigitalDTO[]
  hayDelegados: boolean
  categoriasAño: number[]
  jugadoresPorCategoria: Record<number, CarnetDigitalDTO[]>
  temaTorneo: TemaFranja
  colorAgrupadorDelEquipo: string | undefined
  modoSeleccion: boolean
  jugadoresSeleccionados: number[]
  onSectionLayout: (seccion: number | 'delegados', event: LayoutChangeEvent) => void
  onLongPress: (jugador: CarnetDigitalDTO) => void
  onToggle: (id: number) => void
}

export default function ListaCarnetsEquipo({
  delegados,
  hayDelegados,
  categoriasAño,
  jugadoresPorCategoria,
  temaTorneo,
  colorAgrupadorDelEquipo,
  modoSeleccion,
  jugadoresSeleccionados,
  onSectionLayout,
  onLongPress,
  onToggle,
}: ListaCarnetsEquipoProps) {
  return (
    <View className="p-2.5">
      {hayDelegados && (
        <View key="delegados" onLayout={(event) => onSectionLayout('delegados', event)}>
          <FranjaSeccion variante="separador" tema={temaTorneo}>
            DT/Delegado
          </FranjaSeccion>
          {delegados.map((jugador) => (
            <Carnet
              key={jugador.id}
              jugador={jugador}
              colorAgrupadorEquipo={colorAgrupadorDelEquipo}
              modoSeleccion={modoSeleccion}
              seleccionado={false}
              onPress={undefined}
              onLongPress={undefined}
            />
          ))}
        </View>
      )}
      {categoriasAño.map((año) => (
        <View key={año} onLayout={(event) => onSectionLayout(año, event)}>
          <FranjaSeccion variante="separador" tema={temaTorneo}>
            Categoría {año}
          </FranjaSeccion>
          {jugadoresPorCategoria[año].map((jugador) => (
            <Carnet
              key={jugador.id}
              jugador={jugador}
              modoSeleccion={modoSeleccion}
              seleccionado={jugadoresSeleccionados.includes(jugador.id!)}
              onPress={modoSeleccion ? () => onToggle(jugador.id!) : undefined}
              onLongPress={modoSeleccion ? undefined : () => onLongPress(jugador)}
            />
          ))}
        </View>
      ))}
    </View>
  )
}
