/**
 * Tests para configs-por-liga/color-base.js
 */
describe('color-base.js', () => {
  const originalLeagueId = process.env.LIGA_ID

  afterEach(() => {
    jest.resetModules()
    if (originalLeagueId !== undefined) {
      process.env.LIGA_ID = originalLeagueId
    } else {
      delete process.env.LIGA_ID
    }
  })

  it('edefi (UNILIGA) devuelve green y hex válido', () => {
    process.env.LIGA_ID = 'edefi'
    const c = require('../color-base.js')
    expect(c.tailwind).toBe('green')
    expect(c.splashHex).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('multiliga devuelve gray (primera liga: luefi) y splash liga-700', () => {
    process.env.LIGA_ID = 'multiliga'
    const c = require('../color-base.js')
    const colors = require('tailwindcss/colors')
    expect(c.tailwind).toBe('gray')
    expect(c.splashHex).toBe(colors.gray[700])
  })

  it('sin LIGA_ID lanza error', () => {
    delete process.env.LIGA_ID
    expect(() => require('../color-base.js')).toThrow('LIGA_ID es obligatorio')
  })

  it('liga no uniliga (ej. luefi) lanza error', () => {
    process.env.LIGA_ID = 'luefi'
    expect(() => require('../color-base.js')).toThrow(/no está en APPS_UNILIGAS/)
  })

  it('splashHex usa liga-700 (verde para edefi, gray para multiliga)', () => {
    const colors = require('tailwindcss/colors')
    process.env.LIGA_ID = 'edefi'
    const edefi = require('../color-base.js')
    expect(edefi.splashHex).toBe(colors.green[700])

    jest.resetModules()
    process.env.LIGA_ID = 'multiliga'
    const multiliga = require('../color-base.js')
    expect(multiliga.splashHex).toBe(colors.gray[700])
  })
})
