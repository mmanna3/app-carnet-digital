/**
 * Tests para configs-por-liga/datos.js
 */
describe('datos.js', () => {
  const {
    LIGAS,
    APPS_UNILIGAS,
    LIGAS_DE_APP_MULTILIGA,
    CONFIG_APP_MULTILIGA,
  } = require('../datos.js')

  it('LIGAS tiene luefi y edefi', () => {
    expect(LIGAS.luefi).toBeDefined()
    expect(LIGAS.edefi).toBeDefined()
    expect(LIGAS.luefi.leagueId).toBe('luefi')
    expect(LIGAS.edefi.leagueId).toBe('edefi')
  })

  it('APPS_UNILIGAS contiene solo edefi', () => {
    expect(APPS_UNILIGAS).toContain('edefi')
    expect(APPS_UNILIGAS).not.toContain('luefi')
  })

  it('LIGAS_DE_APP_MULTILIGA contiene solo luefi', () => {
    expect(LIGAS_DE_APP_MULTILIGA).toContain('luefi')
    expect(LIGAS_DE_APP_MULTILIGA).not.toContain('edefi')
  })

  it('CONFIG_APP_MULTILIGA tiene appId y appName', () => {
    expect(CONFIG_APP_MULTILIGA.appId).toBeDefined()
    expect(CONFIG_APP_MULTILIGA.appName).toBe('Ligas y Torneos')
  })

  it('luefi (LigaEnAppMultiliga) solo tiene leagueId, leagueDisplayName, apiUrl, colorBase', () => {
    const luefi = LIGAS.luefi
    expect(Object.keys(luefi)).toEqual(
      expect.arrayContaining(['leagueId', 'leagueDisplayName', 'apiUrl', 'colorBase'])
    )
    expect(luefi).not.toHaveProperty('appId')
    expect(luefi).not.toHaveProperty('appName')
  })

  it('edefi (LigaConAppPropia) tiene config completa de app', () => {
    const edefi = LIGAS.edefi
    expect(edefi).toHaveProperty('appId')
    expect(edefi).toHaveProperty('appName')
    expect(edefi).toHaveProperty('icon')
    expect(edefi).toHaveProperty('scheme')
  })
})
