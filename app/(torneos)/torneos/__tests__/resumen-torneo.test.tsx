import { lineaContextoZona } from '@/torneos/_zona-detalle/resumen-torneo'

describe('lineaContextoZona', () => {
  it('une fase y zona cuando no hay grupos', () => {
    expect(lineaContextoZona({ fase: 'Fase A', zona: 'Zona Norte' })).toBe('Fase A · Zona Norte')
  })

  it('incluye grupo de fases y subgrupo cuando existen', () => {
    expect(
      lineaContextoZona({
        grupoDeFases: 'Grupo A',
        subgrupo: 'Subfase B',
        fase: 'Fase C',
        zona: 'Zona Sur',
      })
    ).toBe('Grupo A · Subfase B · Fase C · Zona Sur')
  })

  it('omite segmentos vacíos', () => {
    expect(
      lineaContextoZona({
        grupoDeFases: 'Grupo A',
        fase: 'Fase C',
        zona: 'Zona Sur',
      })
    ).toBe('Grupo A · Fase C · Zona Sur')
  })

  it('devuelve guión si no hay datos', () => {
    expect(lineaContextoZona({})).toBe('—')
  })
})
