/**
 * Tests para configs-por-liga/deep-links.js
 */
describe('configDeepLinks', () => {
  const { configDeepLinks } = require('../deep-links.js')
  const { LIGAS, CONFIG_APP_MULTILIGA } = require('../datos.js')

  it('con dominio arma associatedDomains de iOS', () => {
    const { ios } = configDeepLinks('admin.edefi.com.ar')
    expect(ios.associatedDomains).toEqual(['applinks:admin.edefi.com.ar'])
  })

  it('con dominio arma el intent filter verificado de Android para /registro-arbitro', () => {
    const { android } = configDeepLinks('admin.edefi.com.ar')
    expect(android.intentFilters).toEqual([
      {
        action: 'VIEW',
        autoVerify: true,
        category: ['BROWSABLE', 'DEFAULT'],
        data: [{ scheme: 'https', host: 'admin.edefi.com.ar', pathPrefix: '/registro-arbitro' }],
      },
    ])
  })

  it.each([undefined, ''])('sin dominio (%p) no declara nada', (dominio) => {
    expect(configDeepLinks(dominio)).toEqual({ ios: {}, android: {} })
  })

  it('edefi tiene dominio de deep links', () => {
    expect(LIGAS.edefi.dominioDeepLinks).toBe('admin.edefi.com.ar')
  })

  it('la app multiliga no tiene dominio de deep links', () => {
    expect(CONFIG_APP_MULTILIGA.dominioDeepLinks).toBeUndefined()
    expect(LIGAS.luefi.dominioDeepLinks).toBeUndefined()
  })
})
