# Tests E2E con Maestro — Android

## Prerequisitos

1. **Maestro** instalado: `curl -Ls "https://get.maestro.mobile.dev" | bash`
2. **Emulador Android** corriendo (abrirlo desde Android Studio o AVD Manager)
3. **iTerm** abierto con al menos una pestaña activa

## Correr todos los tests

```bash
npm run e2e
```

Abre automáticamente 3 pestañas en iTerm:

| Pestaña | Qué corre |
|---------|-----------|
| 1 | Mock server HTTP en puerto 3001 (`node e2e/mock-server.js`) |
| 2 | Metro bundler (`LIGA_ID=edefi npm start`) |
| 3 | Build + instalación en el emulador → cuando termina, lanza Maestro |

La pestaña 3 ejecuta en secuencia:
```bash
LIGA_ID=edefi npm run android && npm run test:e2e:android
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
