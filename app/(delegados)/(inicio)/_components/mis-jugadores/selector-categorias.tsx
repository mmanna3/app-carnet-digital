import React from 'react'
import { ScrollView } from 'react-native'
import { FranjaSeccion, type TemaFranja } from '@/design-system/componentes'

type SelectorCategoriasProps = {
  secciones: (number | 'delegados')[]
  temaTorneo: TemaFranja
  onSeleccionar: (seccion: number | 'delegados') => void
}

export default function SelectorCategorias({
  secciones,
  temaTorneo,
  onSeleccionar,
}: SelectorCategoriasProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      {secciones.map((seccion) => (
        <FranjaSeccion
          key={`button-${seccion}`}
          variante="pill"
          tema={temaTorneo}
          className="mx-1.5 mb-0"
          onPress={() => onSeleccionar(seccion)}
        >
          {seccion === 'delegados' ? 'DT/Delegado' : String(seccion)}
        </FranjaSeccion>
      ))}
    </ScrollView>
  )
}
