# Registro de árbitros: acceso solo por deep link

## Qué queremos

Al flujo de registro de árbitros (`/registro-arbitro`) se tiene que entrar **solo con un link** que la gente de la liga les pasa a los árbitros por WhatsApp. El árbitro toca el link y se le abre la app directo en el wizard. No tiene que haber forma de llegar desde la UI de la app.

Alcance: **solo EDeFI** (app unilliga, `LIGA_ID=edefi`). La app multiliga queda afuera por ahora.

Depende del PR de registro de árbitros (mmanna3/app-carnet-digital#1). Esto se hace sobre ese PR mergeado.

## Antes de empezar

1. **El back tiene que estar listo y deployado.** Los archivos `.well-known` y la página que manda al store salen de liga-be: ver `liga-be/docs/requerimientos/deep-link-registro-arbitro.md`. Ese requerimiento también explica, paso a paso, cómo conseguir el **Team ID de Apple**, el **ID de la app en el App Store** y la **huella SHA-256 de Android**. Los tiene que conseguir un admin antes de arrancar. Sin eso, el link no abre la app.
2. **Capability "Associated Domains" en Apple** (también la tiene que hacer un admin):
   1. Entrar a <https://developer.apple.com/account> y abrir **Certificates, Identifiers & Profiles → Identifiers**.
   2. Abrir `com.ykn.edefidelegados`.
   3. Tildar **Associated Domains** y guardar.

   Si EAS maneja las credenciales, la activa solo en el próximo build, pero conviene confirmar que quedó tildada.

## 1. Sacar la card del Home

- Borrar la `Tarjeta` `card-arbitros` de `app/(home)/home.tsx`, junto con su `handleRegistrarArbitro`.
- La ruta `RUTAS.REGISTRO_ARBITRO` y el segmento público `registro-arbitro` del auth guard **se quedan**: el deep link tiene que poder entrar sin login.

## 2. El link

WhatsApp solo vuelve clickeables los links `http(s)`. Un `carnet-edefi://registro-arbitro` aparece como texto plano. Por eso usamos **Universal Links (iOS) y App Links (Android)** sobre el dominio de la liga:

```
https://admin.edefi.com.ar/registro-arbitro
```

El dominio no se hardcodea: va en la config de la liga (`configs-por-liga/datos.js`, por ejemplo un campo `dominioDeepLinks`), así mañana se puede sumar otra liga.

Qué pasa al tocar el link:

| Situación                              | Resultado                                                                                                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiene la app instalada (iOS o Android) | Se abre la app en el paso 1 del wizard, con el formulario vacío. Da igual si la app estaba cerrada, en segundo plano o con un delegado logueado.                                                  |
| No tiene la app                        | Se abre una página web que detecta iOS o Android y redirige a App Store o Play Store. Si no es ninguno de los dos, muestra los dos links. Después de instalar, el árbitro vuelve a tocar el link. |

### iOS (Universal Links)

- En `app.config.ts`: `ios.associatedDomains: ['applinks:<dominio>']`, solo si la liga tiene `dominioDeepLinks`.
- iOS verifica el dominio con `https://<dominio>/.well-known/apple-app-site-association`, que sirve liga-be.

### Android (App Links)

Es el equivalente a Universal Links:

- En `app.config.ts`: `android.intentFilters` con `autoVerify: true`, `action: VIEW`, categorías `BROWSABLE` y `DEFAULT`, y `data: { scheme: 'https', host: <dominio>, pathPrefix: '/registro-arbitro' }`.
- Android verifica el dominio con `https://<dominio>/.well-known/assetlinks.json`, que sirve liga-be.
- Cuando se instala la app, Android verifica el dominio. Si la verificación sale bien, el link abre la app directo. Si falla, se abre el navegador y cae en la página que manda al store, así que nunca queda roto.

La página que manda al store, si no está la app, también la sirve liga-be (ver su requerimiento).

## 3. En la app

- Al entrar por el link, el wizard **siempre arranca de cero**: `resetear()` al montar `registro-arbitro.tsx`. Ya está pedido en la review del PR.
- "Volver" en el paso 1 y "Volver al inicio" en la pantalla final siguen llevando a `RUTAS.HOME`.
- No hace falta `+native-intent`: el path del link (`/registro-arbitro`) es el mismo que la ruta de Expo Router.

## Tests

- Jest: el Home **no** renderiza `card-arbitros`.
- Jest: `app.config.ts` arma `associatedDomains` e `intentFilters` solo si la liga tiene `dominioDeepLinks`.
- E2E: `e2e/arbitro_registro.yaml` deja de tocar la card y entra con `openLink`. En CI usá el scheme (`carnet-edefi://registro-arbitro`), porque el emulador no verifica App Links. Al terminar, que verifique que vuelve al Home.
- Prueba manual en dispositivo real con una build nativa. En Expo Go no andan los Universal/App Links. Hay que probar estos casos:
  - Link desde WhatsApp con la app instalada, en iOS y en Android.
  - Link con la app cerrada y con la app en segundo plano.
  - Link sin la app instalada: tiene que redirigir al store.
  - Herramientas útiles: `adb shell pm get-app-links com.ykn.edefidelegados` para ver el estado de la verificación, y el validador de AASA de Apple.

## Al terminar

- Subir la versión en `app.config.ts`. Cambiar `associatedDomains` o `intentFilters` requiere **build nativa nueva**: no alcanza con una actualización OTA.
- Agregar el link y cómo probarlo al `CLAUDE.md`.
