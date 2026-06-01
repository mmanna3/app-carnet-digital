import React from 'react'
import { BotonUi } from '@/design-system/componentes/boton'

interface Props {
  texto: string
  onPress: () => void
  icono?: React.ComponentProps<typeof BotonUi>['icono']
  variante?: 'primario' | 'oscuro'
  deshabilitado?: boolean
  testID?: string
}

export default function BotonWizard({
  texto,
  onPress,
  icono,
  variante = 'primario',
  deshabilitado = false,
  testID,
}: Props) {
  return (
    <BotonUi
      testID={testID}
      texto={texto}
      onPress={onPress}
      icono={icono}
      deshabilitado={deshabilitado}
      variante={variante === 'oscuro' ? 'Secundario' : 'Principal'}
      className="w-full"
    />
  )
}
