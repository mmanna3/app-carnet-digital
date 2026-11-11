/**
 * Universal Links (iOS) y App Links (Android) de una liga.
 *
 * El back sirve en el dominio los archivos de verificación (`/.well-known/...`) y la página
 * que manda al store si la app no está instalada.
 */

/** Paths del dominio que abren la app. Coinciden con las rutas de Expo Router. */
const PATHS_DEEP_LINK = ['/registro-arbitro']

/**
 * Arma la config nativa de deep links para `app.config.ts`.
 * Sin dominio devuelve objetos vacíos: la app no declara ningún dominio.
 *
 * @param {string | undefined} dominio Ej: 'admin.edefi.com.ar'
 * @returns {{ ios: { associatedDomains?: string[] }, android: { intentFilters?: object[] } }}
 */
function configDeepLinks(dominio) {
  if (!dominio) return { ios: {}, android: {} }
  return {
    ios: { associatedDomains: [`applinks:${dominio}`] },
    android: {
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          category: ['BROWSABLE', 'DEFAULT'],
          data: PATHS_DEEP_LINK.map((pathPrefix) => ({
            scheme: 'https',
            host: dominio,
            pathPrefix,
          })),
        },
      ],
    },
  }
}

module.exports = { configDeepLinks, PATHS_DEEP_LINK }
