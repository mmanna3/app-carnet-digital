const IGNORADOS = ['/api/clients.ts', 'FIGMA-UI-PROTOTYPE']

const filtrar = (archivos) =>
  archivos.filter((archivo) => !IGNORADOS.some((patron) => archivo.includes(patron)))

/** @type {import('lint-staged').Configuration} */
export default {
  '*.{js,jsx,ts,tsx,mjs,cjs}': (archivos) => {
    const filtrados = filtrar(archivos)
    if (filtrados.length === 0) return []
    const lista = filtrados.join(' ')
    return [`prettier --write ${lista}`, `eslint --fix ${lista}`]
  },
  '*.{md,css,yml,yaml}': 'prettier --write',
  '{package,tsconfig,eas,app.config}.json': 'prettier --write',
}
