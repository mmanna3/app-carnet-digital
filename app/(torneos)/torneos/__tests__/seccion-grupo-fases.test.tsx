import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import {
  SeccionElementoTorneo,
  ListaElementosTorneo,
} from '@/torneos/_components/seccion-grupo-fases'
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

const propsBase = {
  torneoId: 1,
  torneoNombre: 'Torneo',
  grande: false,
  onNavegarZona: jest.fn(),
}

describe('SeccionElementoTorneo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('muestra fase colapsada por defecto (sin zonas visibles)', () => {
    const elemento = InformacionInicialElementoTorneoDTO.fromJS({
      tipo: 'fase',
      id: 1,
      nombre: 'Fase A',
      tipoDeFase: 'Regular',
      zonas: [{ id: 10, nombre: 'Zona Norte', orden: 1 }],
    })

    const { getByText, queryByTestId } = render(
      <SeccionElementoTorneo
        elemento={elemento}
        {...propsBase}
        expandido={false}
        onToggle={jest.fn()}
      />
    )

    expect(getByText('Fase A')).toBeTruthy()
    expect(queryByTestId('tarjeta-Zona Norte')).toBeNull()
  })

  it('muestra zonas al expandir fase', () => {
    const elemento = InformacionInicialElementoTorneoDTO.fromJS({
      tipo: 'fase',
      id: 1,
      nombre: 'Fase A',
      tipoDeFase: 'Regular',
      zonas: [{ id: 10, nombre: 'Zona Norte', orden: 1 }],
    })

    const { getByTestId } = render(
      <SeccionElementoTorneo
        elemento={elemento}
        {...propsBase}
        expandido={true}
        onToggle={jest.fn()}
      />
    )

    expect(getByTestId('tarjeta-Zona Norte')).toBeTruthy()
  })

  it('navega a zona al presionar tarjeta', () => {
    const elemento = InformacionInicialElementoTorneoDTO.fromJS({
      tipo: 'fase',
      id: 1,
      nombre: 'Fase A',
      tipoDeFase: 'Regular',
      zonas: [{ id: 10, nombre: 'Zona Norte', orden: 1 }],
    })

    const onNavegar = jest.fn()
    const { getByTestId } = render(
      <SeccionElementoTorneo
        elemento={elemento}
        {...propsBase}
        onNavegarZona={onNavegar}
        expandido={true}
        onToggle={jest.fn()}
      />
    )

    fireEvent.press(getByTestId('tarjeta-Zona Norte'))
    expect(onNavegar).toHaveBeenCalledWith(
      expect.objectContaining({
        faseNombre: 'Fase A',
        zonaNombre: 'Zona Norte',
      })
    )
  })

  it('incluye grupo de fases y subgrupo al navegar', () => {
    const elemento = InformacionInicialElementoTorneoDTO.fromJS({
      tipo: 'fase',
      id: 2,
      nombre: 'Fase B',
      tipoDeFase: 'Regular',
      zonas: [{ id: 11, nombre: 'Zona Sur', orden: 1 }],
    })

    const onNavegar = jest.fn()
    const { getByTestId } = render(
      <SeccionElementoTorneo
        elemento={elemento}
        {...propsBase}
        onNavegarZona={onNavegar}
        expandido={true}
        onToggle={jest.fn()}
        nombreGrupoDeFases="Grupo A"
        nombreSubgrupo="Subfase X"
      />
    )

    fireEvent.press(getByTestId('tarjeta-Zona Sur'))
    expect(onNavegar).toHaveBeenCalledWith(
      expect.objectContaining({
        grupoDeFasesNombre: 'Grupo A',
        subgrupoNombre: 'Subfase X',
        faseNombre: 'Fase B',
        zonaNombre: 'Zona Sur',
      })
    )
  })

  it('renderiza grupo anidado con fases colapsadas', () => {
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

    const { getByText, queryByTestId } = render(
      <SeccionElementoTorneo
        elemento={elemento}
        {...propsBase}
        expandido={true}
        onToggle={jest.fn()}
      />
    )

    expect(getByText('Grupo A')).toBeTruthy()
    expect(getByText('Fase B')).toBeTruthy()
    expect(queryByTestId('tarjeta-Zona Sur')).toBeNull()
  })
})

describe('ListaElementosTorneo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expande fase al tocar encabezado', () => {
    const elementos = [
      InformacionInicialElementoTorneoDTO.fromJS({
        tipo: 'fase',
        id: 1,
        nombre: 'Fase A',
        tipoDeFase: 'Regular',
        zonas: [{ id: 10, nombre: 'Zona Norte', orden: 1 }],
      }),
      InformacionInicialElementoTorneoDTO.fromJS({
        tipo: 'fase',
        id: 2,
        nombre: 'Fase B',
        tipoDeFase: 'Regular',
        zonas: [{ id: 11, nombre: 'Zona Sur', orden: 1 }],
      }),
    ]

    const { getByTestId, queryByTestId } = render(
      <ListaElementosTorneo elementos={elementos} {...propsBase} />
    )

    expect(queryByTestId('tarjeta-Zona Norte')).toBeNull()

    fireEvent.press(getByTestId('desplegable-Fase A'))
    expect(getByTestId('tarjeta-Zona Norte')).toBeTruthy()
  })

  it('despliega automáticamente si el torneo tiene una sola fase', () => {
    const elementos = [
      InformacionInicialElementoTorneoDTO.fromJS({
        tipo: 'fase',
        id: 1,
        nombre: 'Fase A',
        tipoDeFase: 'Regular',
        zonas: [{ id: 10, nombre: 'Zona Norte', orden: 1 }],
      }),
    ]

    const { getByTestId } = render(
      <ListaElementosTorneo
        elementos={elementos}
        {...propsBase}
        esRaiz
        expandidoInicialHabilitado
      />
    )

    expect(getByTestId('tarjeta-Zona Norte')).toBeTruthy()
  })

  it('despliega grupo y fase si hay una sola fase dentro de un grupo', () => {
    const elementos = [
      InformacionInicialElementoTorneoDTO.fromJS({
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
      }),
    ]

    const { getByTestId } = render(
      <ListaElementosTorneo
        elementos={elementos}
        {...propsBase}
        esRaiz
        expandidoInicialHabilitado
      />
    )

    expect(getByTestId('tarjeta-Zona Sur')).toBeTruthy()
  })

  it('comportamiento acordeón: abrir una fase cierra la otra', () => {
    const elementos = [
      InformacionInicialElementoTorneoDTO.fromJS({
        tipo: 'fase',
        id: 1,
        nombre: 'Fase A',
        tipoDeFase: 'Regular',
        zonas: [{ id: 10, nombre: 'Zona Norte', orden: 1 }],
      }),
      InformacionInicialElementoTorneoDTO.fromJS({
        tipo: 'fase',
        id: 2,
        nombre: 'Fase B',
        tipoDeFase: 'Regular',
        zonas: [{ id: 11, nombre: 'Zona Sur', orden: 1 }],
      }),
    ]

    const { getByTestId, queryByTestId } = render(
      <ListaElementosTorneo elementos={elementos} {...propsBase} />
    )

    fireEvent.press(getByTestId('desplegable-Fase A'))
    expect(getByTestId('tarjeta-Zona Norte')).toBeTruthy()
    expect(queryByTestId('tarjeta-Zona Sur')).toBeNull()

    fireEvent.press(getByTestId('desplegable-Fase B'))
    expect(queryByTestId('tarjeta-Zona Norte')).toBeNull()
    expect(getByTestId('tarjeta-Zona Sur')).toBeTruthy()
  })
})
