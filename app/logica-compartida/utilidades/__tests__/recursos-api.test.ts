import { numeroOGuion, textoOGuion, uriRecursoPublicoApi } from '../recursos-api'

describe('uriRecursoPublicoApi', () => {
  it('devuelve null si la ruta está vacía', () => {
    expect(uriRecursoPublicoApi('https://api.test', '')).toBeNull()
    expect(uriRecursoPublicoApi('https://api.test', undefined)).toBeNull()
  })

  it('devuelve URLs absolutas sin modificar', () => {
    expect(uriRecursoPublicoApi('https://api.test', 'https://cdn.test/img.png')).toBe(
      'https://cdn.test/img.png'
    )
  })

  it('concatena base y ruta relativa', () => {
    expect(uriRecursoPublicoApi('https://api.test/', '/Imagenes/1.jpg')).toBe(
      'https://api.test/Imagenes/1.jpg'
    )
    expect(uriRecursoPublicoApi('https://api.test', 'Imagenes/1.jpg')).toBe(
      'https://api.test/Imagenes/1.jpg'
    )
  })
})

describe('textoOGuion', () => {
  it('devuelve guión para vacío', () => {
    expect(textoOGuion('')).toBe('—')
    expect(textoOGuion(undefined)).toBe('—')
  })

  it('devuelve el texto recortado', () => {
    expect(textoOGuion('  Boca  ')).toBe('Boca')
  })
})

describe('numeroOGuion', () => {
  it('formatea números finitos', () => {
    expect(numeroOGuion(3)).toBe('3')
    expect(numeroOGuion(0)).toBe('0')
  })

  it('devuelve guión para valores inválidos', () => {
    expect(numeroOGuion(undefined)).toBe('—')
    expect(numeroOGuion(NaN)).toBe('—')
  })
})
