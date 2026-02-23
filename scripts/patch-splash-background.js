#!/usr/bin/env node
/**
 * Parchea styles.xml para añadir android:windowBackground al tema del splash.
 * Ejecutar después de: LIGA_ID=edefi npx expo prebuild --clean
 */
const fs = require('fs')
const path = require('path')

const stylesPath = path.join(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'res',
  'values',
  'styles.xml'
)

if (!fs.existsSync(stylesPath)) {
  console.warn('[patch-splash] android/styles.xml no encontrado, omitiendo')
  process.exit(0)
}

let content = fs.readFileSync(stylesPath, 'utf8')
const windowBgItem =
  '<item name="android:windowBackground">@color/splashscreen_background</item>'

const hasWindowBg = content.includes(
  'name="android:windowBackground">@color/splashscreen_background'
)
if (content.includes('Theme.App.SplashScreen') && !hasWindowBg) {
  content = content.replace(
    /(<style name="Theme\.App\.SplashScreen"[^>]*>)\s*/,
    `$1\n    ${windowBgItem}\n    `
  )
  fs.writeFileSync(stylesPath, content)
  console.log('[patch-splash] android:windowBackground añadido al tema splash')
}
