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

| Pestaña | Qué corre                                                         |
| ------- | ----------------------------------------------------------------- |
| 1       | Mock server HTTP en puerto 3001 (`node e2e/mock-server.js`)       |
| 2       | Metro bundler con `EXPO_PUBLIC_E2E_API_URL=http://localhost:3001` |
| 3       | Build + instalación en simulador → cuando termina, lanza Maestro  |

La pestaña 3 ejecuta en secuencia:

```bash
EXPO_PUBLIC_E2E_API_URL=http://localhost:3001 LIGA_ID=edefi npm run ios && npm run test:e2e:ios
```

También podés correr Maestro directamente si Metro y la app ya están corriendo:

```bash
npm run test:e2e:ios
```

## Convención de nombres

Cada flow tiene un prefijo de dominio (`fichaje_`, `delegado_` o `torneo_`), palabras separadas con guiones medios, y un atributo `name` legible en español para los reportes de Maestro.

Ejemplos: `fichaje_nuevo-jugador.yaml`, `delegado_navegacion-tabs-principal.yaml`.

## Correr un test puntual

Con Metro y el mock server ya corriendo:

```bash
npm run test:e2e:single e2e/fichaje_nuevo-jugador.yaml
```

## Suite actual (14 flows)

| Archivo                                        | Qué cubre                                         |
| ---------------------------------------------- | ------------------------------------------------- |
| `fichaje_nuevo-jugador.yaml`                   | Fichaje anónimo — jugador nuevo (wizard completo) |
| `fichaje_jugador-fichado-en-otro-equipo.yaml`  | Fichaje anónimo — jugador ya fichado              |
| `delegado_fichaje-no-existente.yaml`           | Registro de delegado nuevo                        |
| `delegado_fichaje-ya-existente.yaml`           | Registro de delegado ya existente                 |
| `delegado_fichaje-nuevo-jugador.yaml`          | Fichaje autenticado — jugador nuevo               |
| `delegado_fichaje-jugador-en-otro-equipo.yaml` | Fichaje autenticado — jugador en otro equipo      |
| `delegado_navegacion-tabs-principal.yaml`      | Login, Mis jugadores, Buscar y Pendientes         |
| `delegado_cerrar-sesion.yaml`                  | Cerrar sesión                                     |
| `delegado_cambiar-equipo.yaml`                 | Cambiar equipo                                    |
| `delegado_eliminar-jugador.yaml`               | Eliminar jugador individual                       |
| `delegado_transferir-jugador.yaml`             | Transferir jugador                                |
| `delegado_eliminar-jugadores-masivo.yaml`      | Eliminación masiva                                |
| `delegado_error-al-eliminar.yaml`              | Error de API al eliminar                          |
| `delegado_error-al-cargar-jugadores.yaml`      | Error de API al cargar jugadores                  |

Las validaciones de formulario del paso datos (`fichaje_dni-formato-invalido`, `fichaje_campos-obligatorios`, `fichaje_codigo-invalido`) se cubren con tests unitarios en Jest.

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
