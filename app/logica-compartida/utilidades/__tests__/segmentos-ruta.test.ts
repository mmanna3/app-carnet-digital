import {
  enGrupo,
  segmentosVisibles,
  tieneSegmento,
} from '@/logica-compartida/utilidades/segmentos-ruta'

describe('segmentos-ruta', () => {
  it('filtra route groups ocultos', () => {
    expect(segmentosVisibles(['(home)', 'home'])).toEqual(['home'])
    expect(segmentosVisibles(['(delegados)', 'login'])).toEqual(['login'])
    expect(segmentosVisibles(['(torneos)', 'torneos', 'torneo-detalle'])).toEqual([
      'torneos',
      'torneo-detalle',
    ])
  })

  it('detecta grupos y segmentos', () => {
    expect(enGrupo(['(delegados)', 'login'], '(delegados)')).toBe(true)
    expect(tieneSegmento(['(fichaje-jugador)', 'fichajes'], 'fichajes')).toBe(true)
    expect(tieneSegmento(['(home)', 'home'], 'torneos')).toBe(false)
  })
})
