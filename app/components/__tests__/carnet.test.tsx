import React from 'react'
import { render, screen } from '@testing-library/react-native'
import Carnet from '../carnet'
import { EstadoJugador } from '../../types/estado-jugador'

// Helper: plain object cast al tipo del componente para no depender del constructor NSwag
const crearJugador = (overrides: Record<string, any> = {}) =>
  ({
    id: 1,
    nombre: 'María',
    apellido: 'González',
    dni: '45678901',
    fechaNacimiento: new Date('2008-03-20'),
    fotoCarnet: 'https://example.com/foto.jpg',
    equipo: 'Atlético Norte',
    torneo: 'Torneo Apertura',
    estado: EstadoJugador.Activo,
    ...overrides,
  }) as any

describe('Carnet', () => {
  describe('información básica', () => {
    it('muestra el DNI', () => {
      render(<Carnet jugador={crearJugador({ dni: '11223344' })} />)
      expect(screen.getByText('11223344')).toBeTruthy()
    })

    it('muestra el nombre', () => {
      render(<Carnet jugador={crearJugador({ nombre: 'Roberto' })} />)
      expect(screen.getByText('Roberto')).toBeTruthy()
    })

    it('muestra el apellido', () => {
      render(<Carnet jugador={crearJugador({ apellido: 'Suárez' })} />)
      expect(screen.getByText('Suárez')).toBeTruthy()
    })

    it('muestra el nombre del equipo', () => {
      render(<Carnet jugador={crearJugador({ equipo: 'Racing Club' })} />)
      expect(screen.getByText('Racing Club')).toBeTruthy()
    })

    it('muestra el torneo', () => {
      render(<Carnet jugador={crearJugador({ torneo: 'Copa Liga' })} />)
      expect(screen.getByText('Copa Liga')).toBeTruthy()
    })
  })

  describe('categoría', () => {
    // Usar constructor local (año, mes, día) para evitar problemas de timezone UTC vs local
    it('muestra los últimos 2 dígitos del año de nacimiento', () => {
      render(<Carnet jugador={crearJugador({ fechaNacimiento: new Date(2008, 5, 15) })} />)
      expect(screen.getByText('Cat 08')).toBeTruthy()
    })

    it('calcula categoría correctamente para 2015', () => {
      render(<Carnet jugador={crearJugador({ fechaNacimiento: new Date(2015, 5, 1) })} />)
      expect(screen.getByText('Cat 15')).toBeTruthy()
    })
  })

  describe('header de estado', () => {
    it('NO muestra el header cuando el jugador está Activo y mostrarEstado=false', () => {
      render(<Carnet jugador={crearJugador({ estado: EstadoJugador.Activo })} mostrarEstado={false} />)
      expect(screen.queryByText('ACTIVO')).toBeNull()
    })

    it('muestra "CARNET SUSPENDIDO" automáticamente para jugadores Suspendidos', () => {
      render(<Carnet jugador={crearJugador({ estado: EstadoJugador.Suspendido })} />)
      expect(screen.getByText('CARNET SUSPENDIDO')).toBeTruthy()
    })

    it('muestra "INHABILITADO" automáticamente para jugadores Inhabilitados', () => {
      render(<Carnet jugador={crearJugador({ estado: EstadoJugador.Inhabilitado })} />)
      expect(screen.getByText('INHABILITADO')).toBeTruthy()
    })

    it('muestra el estado cuando mostrarEstado=true aunque sea Activo', () => {
      render(<Carnet jugador={crearJugador({ estado: EstadoJugador.Activo })} mostrarEstado={true} />)
      expect(screen.getByText('ACTIVO')).toBeTruthy()
    })

    it('muestra "PENDIENTE DE APROBACIÓN" cuando mostrarEstado=true', () => {
      render(
        <Carnet
          jugador={crearJugador({ estado: EstadoJugador.FichajePendienteDeAprobacion })}
          mostrarEstado={true}
        />
      )
      expect(screen.getByText('PENDIENTE DE APROBACIÓN')).toBeTruthy()
    })

    it('muestra "FICHAJE RECHAZADO" cuando mostrarEstado=true', () => {
      render(
        <Carnet
          jugador={crearJugador({ estado: EstadoJugador.FichajeRechazado })}
          mostrarEstado={true}
        />
      )
      expect(screen.getByText('FICHAJE RECHAZADO')).toBeTruthy()
    })
  })

  describe('foto del jugador', () => {
    it('renderiza la imagen cuando hay fotoCarnet', () => {
      const { UNSAFE_getAllByType } = render(
        <Carnet jugador={crearJugador({ fotoCarnet: 'https://example.com/foto.jpg' })} />
      )
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Image } = require('react-native')
      expect(UNSAFE_getAllByType(Image).length).toBeGreaterThan(0)
    })

    it('NO renderiza la imagen cuando fotoCarnet es null', () => {
      const { UNSAFE_queryAllByType } = render(
        <Carnet jugador={crearJugador({ fotoCarnet: null })} />
      )
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Image } = require('react-native')
      expect(UNSAFE_queryAllByType(Image)).toHaveLength(0)
    })
  })

  describe('sección de motivo', () => {
    const jugadorConMotivo = crearJugador({
      estado: EstadoJugador.FichajeRechazado,
      motivo: 'Documentación incompleta',
    })

    it('muestra el motivo cuando mostrarMotivo=true y existe motivo', () => {
      render(<Carnet jugador={jugadorConMotivo} mostrarMotivo={true} />)
      expect(screen.getByText('Documentación incompleta')).toBeTruthy()
    })

    it('NO muestra el motivo cuando mostrarMotivo=false', () => {
      render(<Carnet jugador={jugadorConMotivo} mostrarMotivo={false} />)
      expect(screen.queryByText('Documentación incompleta')).toBeNull()
    })

    it('NO muestra la sección motivo cuando mostrarMotivo=true pero no hay motivo', () => {
      render(
        <Carnet
          jugador={crearJugador({ estado: EstadoJugador.FichajeRechazado })}
          mostrarMotivo={true}
        />
      )
      expect(screen.queryByText('Motivo:')).toBeNull()
    })
  })
})
