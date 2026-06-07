import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { PantallaPublica } from '@/design-system/componentes/pantalla'
import { Texto } from '@/design-system/componentes/texto'

type Props = {
  titulo: string
  onVolver?: () => void
  children: React.ReactNode
  scroll?: boolean
  testID?: string
}

/** Shell oscuro para flujos tipo wizard (fichaje, registro). */
export function LayoutAsistente({
  titulo,
  onVolver,
  children,
  scroll = true,
  testID,
}: Props) {
  return (
    <PantallaPublica scroll={scroll} className="bg-surface">
      <View testID={testID} className={`gap-4 px-4 pt-2 ${scroll ? '' : 'flex-1'}`}>
        <View className="flex-row items-center gap-2">
          {onVolver ? (
            <TouchableOpacity
              testID="boton-atras"
              onPress={onVolver}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="-ml-1 rounded-lg p-2"
            >
              <Feather name="chevron-left" size={24} color="#e4e4e7" />
            </TouchableOpacity>
          ) : null}
          <Texto variante="titulo" className="flex-1 text-zinc-100">
            {titulo}
          </Texto>
        </View>
        {children}
      </View>
    </PantallaPublica>
  )
}
