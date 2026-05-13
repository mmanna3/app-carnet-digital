#!/usr/bin/env node
/**
 * Expo export web coloca assets bajo dist/assets/node_modules/...
 * - La acción FTP-Deploy excluye carpetas "node_modules" en el glob por defecto.
 * - Algunos hosts devuelven 404 si la URL contiene "node_modules".
 *
 * Renombra a assets/vendor y reescribe las rutas en HTML/JS/CSS/JSON del export.
 */
const fs = require('fs')
const path = require('path')

const DIST = path.join(__dirname, '..', 'dist')
const OLD_REL = path.join('assets', 'node_modules')
const NEW_REL = path.join('assets', 'vendor')
const OLD_PREFIX = '/assets/node_modules/'
const NEW_PREFIX = '/assets/vendor/'

function walk(dir, onFile) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, onFile)
    else onFile(p)
  }
}

function main() {
  const oldDir = path.join(DIST, OLD_REL)
  const newDir = path.join(DIST, NEW_REL)

  if (!fs.existsSync(oldDir)) {
    console.warn('postprocess-web-export: dist/assets/node_modules no existe (omitido)')
    return
  }

  if (fs.existsSync(newDir)) {
    console.error('postprocess-web-export: dist/assets/vendor ya existe; abortando')
    process.exit(1)
  }

  fs.renameSync(oldDir, newDir)
  console.log('postprocess-web-export: renombrado assets/node_modules → assets/vendor')

  const textExt = /\.(js|html|css|json|map)$/i
  let filesChanged = 0

  walk(DIST, (p) => {
    if (!textExt.test(p)) return
    let content = fs.readFileSync(p, 'utf8')
    if (!content.includes(OLD_PREFIX)) return
    fs.writeFileSync(p, content.split(OLD_PREFIX).join(NEW_PREFIX))
    filesChanged += 1
  })

  console.log(
    `postprocess-web-export: rutas ${OLD_PREFIX} → ${NEW_PREFIX} (${filesChanged} archivos)`
  )
}

main()
