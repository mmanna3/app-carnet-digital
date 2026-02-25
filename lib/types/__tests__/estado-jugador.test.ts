import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '../estado-jugador'

describe('EstadoJugador enum', () => {
  it('tiene los 6 valores correctos', () => {
    expect(EstadoJugador.FichajePendienteDeAprobacion).toBe(1)
    expect(EstadoJugador.FichajeRechazado).toBe(2)
    expect(EstadoJugador.Activo).toBe(3)
    expect(EstadoJugador.Suspendido).toBe(4)
    expect(EstadoJugador.Inhabilitado).toBe(5)
    expect(EstadoJugador.AprobadoPendienteDePago).toBe(6)
  })
})

describe('obtenerTextoEstado', () => {
  it.each([
    [EstadoJugador.FichajePendienteDeAprobacion, 'PENDIENTE DE APROBACIÓN'],
    [EstadoJugador.FichajeRechazado, 'FICHAJE RECHAZADO'],
    [EstadoJugador.Activo, 'ACTIVO'],
    [EstadoJugador.Suspendido, 'CARNET SUSPENDIDO'],
    [EstadoJugador.Inhabilitado, 'INHABILITADO'],
    [EstadoJugador.AprobadoPendienteDePago, 'PENDIENTE DE PAGO'],
  ])('estado %i → "%s"', (estado, textoEsperado) => {
    expect(obtenerTextoEstado(estado)).toBe(textoEsperado)
  })

  it('estado desconocido → "DESCONOCIDO"', () => {
    expect(obtenerTextoEstado(99 as EstadoJugador)).toBe('DESCONOCIDO')
  })
})

describe('obtenerColorEstado', () => {
  it.each([
    [EstadoJugador.FichajePendienteDeAprobacion, '#FFA726'],
    [EstadoJugador.FichajeRechazado, '#EF5350'],
    [EstadoJugador.Activo, '#66BB6A'],
    [EstadoJugador.Suspendido, '#FF7043'],
    [EstadoJugador.Inhabilitado, '#E53935'],
    [EstadoJugador.AprobadoPendienteDePago, '#2513c2'],
  ])('estado %i → color "%s"', (estado, colorEsperado) => {
    expect(obtenerColorEstado(estado)).toBe(colorEsperado)
  })

  it('estado desconocido → gris "#9E9E9E"', () => {
    expect(obtenerColorEstado(99 as EstadoJugador)).toBe('#9E9E9E')
  })
})
