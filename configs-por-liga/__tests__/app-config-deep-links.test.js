/**
 * app.config.ts declara los deep links solo para la liga que tiene dominioDeepLinks.
 */
describe('app.config.ts: deep links', () => {
  const ligaIdOriginal = process.env.LIGA_ID

  afterEach(() => {
    process.env.LIGA_ID = ligaIdOriginal
  })

  function configPara(ligaId) {
    process.env.LIGA_ID = ligaId
    let config
    jest.isolateModules(() => {
      config = require('../../app.config').default()
    })
    return config
  }

  it('edefi declara associatedDomains e intentFilters con su dominio', () => {
    const config = configPara('edefi')
    expect(config.ios.associatedDomains).toEqual(['applinks:admin.edefi.com.ar'])
    expect(config.android.intentFilters).toHaveLength(1)
    expect(config.android.intentFilters[0]).toMatchObject({
      autoVerify: true,
      data: [{ scheme: 'https', host: 'admin.edefi.com.ar', pathPrefix: '/registro-arbitro' }],
    })
  })

  it('multiliga no declara deep links', () => {
    const config = configPara('multiliga')
    expect(config.ios.associatedDomains).toBeUndefined()
    expect(config.android.intentFilters).toBeUndefined()
  })
})
