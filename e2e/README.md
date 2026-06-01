# Tests E2E con Maestro

## Prerequisitos

1. **Maestro** instalado: `curl -Ls "https://get.maestro.mobile.dev" | bash`
2. **iTerm** abierto con al menos una pestaña activa

## Android

### Prerequisitos Android

- **Emulador Android** corriendo (abrirlo desde Android Studio o AVD Manager)

### Correr todos los tests (Android)

```bash
npm run e2e
```

Abre automáticamente 3 pestañas en iTerm:

| Pestaña | Qué corre                                                          |
| ------- | ------------------------------------------------------------------ |
| 1       | Mock server HTTP en puerto 3001 (`node e2e/mock-server.js`)        |
| 2       | Metro bundler (`LIGA_ID=edefi npm start`)                          |
| 3       | Build + instalación en el emulador → cuando termina, lanza Maestro |

La pestaña 3 ejecuta en secuencia:

```bash
LIGA_ID=edefi npm run android && npm run test:e2e:android
```

## iOS

### Prerequisitos iOS

- **Simulador iOS** disponible (Xcode)
- App compilada/instalada en el simulador (`LIGA_ID=edefi npm run ios`)

### Correr todos los tests (iOS)

```bash
bash e2e/run-e2e-ios-dev.sh
```

Abre automáticamente 3 pestañas en iTerm:

| Pestaña | Qué corre                                                          |
| ------- | ------------------------------------------------------------------ |
| 1       | Mock server HTTP en puerto 3001 (`node e2e/mock-server.js`)        |
| 2       | Metro bundler con `EXPO_PUBLIC_E2E_API_URL=http://localhost:3001`  |
| 3       | Build + instalación en simulador → cuando termina, lanza Maestro   |

La pestaña 3 ejecuta en secuencia:

```bash
EXPO_PUBLIC_E2E_API_URL=http://localhost:3001 LIGA_ID=edefi npm run ios && npm run test:e2e:ios
```

También podés correr Maestro directamente si Metro y la app ya están corriendo:

```bash
npm run test:e2e:ios
```

## Correr un test puntual

Con Metro y el mock server ya corriendo:

```bash
npm run test:e2e:single e2e/01_fichaje_nuevo_jugador.yaml
```

## Escenarios del mock server

El servidor corre en modo `happy` por defecto. El endpoint `GET /api/publico/el-dni-esta-fichado` es inteligente según el DNI recibido:

- DNI `87654321` → `true` (tests de flujo ya-fichado / delegado-verde)
- Cualquier otro DNI → `false` (tests de flujo nuevo)

Para cambiar el escenario en runtime:

```bash
curl -X POST http://localhost:3001/_set-scenario -d '{"scenario":"codigo_invalido"}'
```

Escenarios disponibles: `happy`, `codigo_invalido`, `dni_fichado`

## Rutas de la app

Los flujos E2E navegan por **testID** (cards, pasos del wizard), no por URL. Las rutas de la app están centralizadas en `app/logica-compartida/constantes/rutas.ts` (`RUTAS`). Tras cambios de routing, correr `LIGA_ID=edefi npm run typecheck` y `npm run test:ci`.
