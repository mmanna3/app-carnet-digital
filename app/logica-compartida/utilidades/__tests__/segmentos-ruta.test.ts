import {
  enGrupo,
  segmentosVisibles,
  tieneSegmento,
} from '@/logica-compartida/utilidades/segmentos-ruta'

describe('segmentos-ruta', () => {
  it('filtra route groups ocultos', () => {
    expect(segmentosVisibles(['(rutas)', 'home'])).toEqual(['home'])
    expect(segmentosVisibles(['(rutas)', '(auth)', 'login'])).toEqual(['login'])
    expect(segmentosVisibles(['(rutas)', 'torneos', 'torneo-detalle'])).toEqual([
      'torneos',
      'torneo-detalle',
    ])
  })

  it('detecta grupos y segmentos', () => {
    expect(enGrupo(['(rutas)', '(auth)', 'login'], '(auth)')).toBe(true)
    expect(tieneSegmento(['(rutas)', 'fichajes'], 'fichajes')).toBe(true)
    expect(tieneSegmento(['(rutas)', 'home'], 'torneos')).toBe(false)
  })
})
