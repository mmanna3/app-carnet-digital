import {
  redireccionAuthGuard,
  type EstadoAuthGuard,
} from '@/logica-compartida/utilidades/redireccion-auth-guard'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

const SEGMENTOS_REGISTRO_ARBITRO = ['(arbitros)', 'registro-arbitro']
const SEGMENTOS_HOME = ['(home)', 'home']
const SEGMENTOS_MIS_JUGADORES = ['(delegados)', '(inicio)', 'mis-jugadores']

function estado(parcial: Partial<EstadoAuthGuard>): EstadoAuthGuard {
  return {
    segments: SEGMENTOS_HOME,
    esMultiliga: false,
    ligaSeleccionadaId: null,
    isAuthenticated: false,
    equipoSeleccionadoId: null,
    ...parcial,
  }
}

describe('redireccionAuthGuard', () => {
  describe('sin login', () => {
    it.each([
      ['home', SEGMENTOS_HOME],
      ['registro-arbitro', SEGMENTOS_REGISTRO_ARBITRO],
      ['fichajes', ['(fichaje-jugador)', 'fichajes']],
      ['torneos', ['(torneos)', 'torneos']],
      ['inicio-de-sesion', ['(delegados)', 'inicio-de-sesion']],
    ])('deja entrar a %s', (_nombre, segments) => {
      expect(redireccionAuthGuard(estado({ segments }))).toBeNull()
    })

    it('manda al home desde una pantalla de delegado', () => {
      expect(redireccionAuthGuard(estado({ segments: SEGMENTOS_MIS_JUGADORES }))).toBe(RUTAS.HOME)
    })
  })

  describe('logueado con equipo', () => {
    const logueado = { isAuthenticated: true, equipoSeleccionadoId: 1 }

    it('deja entrar a registro-arbitro', () => {
      expect(
        redireccionAuthGuard(estado({ ...logueado, segments: SEGMENTOS_REGISTRO_ARBITRO }))
      ).toBeNull()
    })

    it('deja entrar a sus pantallas', () => {
      expect(
        redireccionAuthGuard(estado({ ...logueado, segments: SEGMENTOS_MIS_JUGADORES }))
      ).toBeNull()
    })

    it('desde el login lo manda a elegir equipo', () => {
      expect(
        redireccionAuthGuard(estado({ ...logueado, segments: ['(delegados)', 'inicio-de-sesion'] }))
      ).toBe(RUTAS.SELECCION_EQUIPO)
    })
  })

  describe('logueado sin equipo', () => {
    const sinEquipo = { isAuthenticated: true, equipoSeleccionadoId: null }

    it('en registro-arbitro (entró por el link) no lo manda a elegir equipo', () => {
      expect(
        redireccionAuthGuard(estado({ ...sinEquipo, segments: SEGMENTOS_REGISTRO_ARBITRO }))
      ).toBeNull()
    })

    it('en otras pantallas lo manda a elegir equipo', () => {
      expect(redireccionAuthGuard(estado({ ...sinEquipo, segments: SEGMENTOS_HOME }))).toBe(
        RUTAS.SELECCION_EQUIPO
      )
    })

    it('en selección de equipo no redirige', () => {
      expect(
        redireccionAuthGuard(
          estado({ ...sinEquipo, segments: ['(delegados)', 'seleccion-de-equipo'] })
        )
      ).toBeNull()
    })
  })

  describe('multiliga', () => {
    it('sin liga elegida manda a elegir liga', () => {
      expect(redireccionAuthGuard(estado({ esMultiliga: true }))).toBe(RUTAS.SELECCION_LIGA)
      expect(
        redireccionAuthGuard(estado({ esMultiliga: true, segments: SEGMENTOS_REGISTRO_ARBITRO }))
      ).toBe(RUTAS.SELECCION_LIGA)
    })

    it('en selección de liga no redirige', () => {
      expect(
        redireccionAuthGuard(
          estado({ esMultiliga: true, segments: ['(home)', 'seleccion-de-liga'] })
        )
      ).toBeNull()
    })

    it('con liga elegida aplica las mismas reglas que unilliga', () => {
      expect(
        redireccionAuthGuard(
          estado({
            esMultiliga: true,
            ligaSeleccionadaId: 'luefi',
            segments: SEGMENTOS_REGISTRO_ARBITRO,
          })
        )
      ).toBeNull()
    })
  })
})
