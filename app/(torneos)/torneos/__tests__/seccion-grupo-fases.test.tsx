import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import { SeccionElementoTorneo } from '@/torneos/_components/seccion-grupo-fases'
import { InformacionInicialElementoTorneoDTO } from '@/lib/api/clients'

jest.mock('@/torneos/_components/tarjeta-torneo', () => ({
  TarjetaTorneo: ({ nombre, onPress }: { nombre: string; onPress?: () => void }) => {
    const { Text, Pressable } = require('react-native')
    return (
      <Pressable onPress={onPress} testID={`tarjeta-${nombre}`}>
        <Text>{nombre}</Text>
      </Pressable>
    )
  },
}))

describe('SeccionElementoTorneo', () => {
  it('renderiza fase con zonas', () => {
    const elemento = InformacionInicialElementoTorneoDTO.fromJS({
      tipo: 'fase',
      id: 1,
      nombre: 'Fase A',
      tipoDeFase: 'Regular',
      zonas: [{ id: 10, nombre: 'Zona Norte', orden: 1 }],
    })

    const { getByText } = render(
      <SeccionElementoTorneo
        elemento={elemento}
        torneoId={1}
        torneoNombre="Torneo"
        grande={false}
        onNavegarZona={jest.fn()}
      />
    )

    expect(getByText('Fase A')).toBeTruthy()
    expect(getByText('Zona Norte')).toBeTruthy()
  })

  it('renderiza grupo anidado con fases', () => {
    const elemento = InformacionInicialElementoTorneoDTO.fromJS({
      tipo: 'grupo',
      grupoId: 5,
      nombreGrupo: 'Grupo A',
      elementos: [
        {
          tipo: 'fase',
          id: 2,
          nombre: 'Fase B',
          tipoDeFase: 'Regular',
          zonas: [{ id: 11, nombre: 'Zona Sur', orden: 1 }],
        },
      ],
    })

    const onNavegar = jest.fn()
    const { getByText, getByTestId } = render(
      <SeccionElementoTorneo
        elemento={elemento}
        torneoId={1}
        torneoNombre="Torneo"
        grande={false}
        onNavegarZona={onNavegar}
      />
    )

    expect(getByText('Grupo A')).toBeTruthy()
    expect(getByText('Fase B')).toBeTruthy()

    fireEvent.press(getByTestId('tarjeta-Zona Sur'))
    expect(onNavegar).toHaveBeenCalledWith(
      expect.objectContaining({
        faseNombre: 'Fase B',
        zonaNombre: 'Zona Sur',
      })
    )
  })
})
