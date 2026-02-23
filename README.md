# Carnet Digital

App React Native + Expo para gestionar carnets digitales de jugadores. Los delegados inician sesión, eligen su equipo y ven/buscan carnets.

## Cómo levantar app

### Levantar back y front
1. Levantar docker
2. `cd liga/scripts`
3. `./buen-dia.sh`

`Para más data, ver README general y README backend`

### Levantar app
1. `LIGA_ID=edefi npm start` — UNILIGA (app solo para EDeFI)
2. `LIGA_ID=multiliga npm start` — MULTILIGA (app con selección de liga)
3. Credenciales: jperez/consulta mgomez/consulta clopez/consulta

(si no funciona, correr en liga-be `scripts/insert-datos.sql`)


## Deploy

**Subir versión en `app.config.ts` antes de build.**

### iOS
```bash
# UNILIGA (una app por liga)
LIGA_ID=edefi npm run ios:build
LIGA_ID=edefi npm run ios:deploy

# MULTILIGA (una app "Carnet Digital")
LIGA_ID=multiliga npm run ios:build
LIGA_ID=multiliga npm run ios:deploy
```

### Android
Mismo flujo con `android:build` y `android:deploy`.


## Arquitectura UNILIGA vs MULTILIGA

### UNILIGA
- Una app compilada por liga (un ícono en el store por liga).
- La liga está fija en build (`LIGA_ID=edefi`).
- No hay pantalla de selección de liga.
- **Actual:** EDeFI tiene su propia app.

### MULTILIGA
- Una sola app "Carnet Digital" con varias ligas.
- En la primera pantalla el usuario selecciona su liga.
- La liga se guarda y se usa para API, colores, logo.
- Menú: "Cambiar liga" (solo en MULTILIGA).
- **Actual:** LUEFI está en la app MULTILIGA.

### Estructura en código

| Archivo | Descripción |
| ------- | ----------- |
| `configs-por-liga/datos.js` | Fuente única: `LIGAS`, `APPS_UNILIGAS`, `LIGAS_DE_APP_MULTILIGA` |
| `configs-por-liga/color-base.js` | Color base para Tailwind y splash según `LIGA_ID` |
| `app.config.ts` | Config de Expo según modo (UNILIGA o MULTILIGA) |
| `app/config/liga.ts` | Config en runtime (`getConfigLiga`, `useConfigLiga`) |
| `app/hooks/use-liga-store.ts` | Store de liga seleccionada (MULTILIGA) |
| `app/seleccion-de-liga.tsx` | Pantalla de selección de liga (MULTILIGA) |

| Variable | Descripción |
| -------- | ----------- |
| `APPS_UNILIGAS` | Ligas con app propia: `['edefi']` |
| `LIGAS_DE_APP_MULTILIGA` | Ligas en la app MULTILIGA: `['luefi']` |

### Comandos por modo

| Modo | LIGA_ID | Ejemplo |
| ---- | --------- | ------- |
| UNILIGA | id de liga en `APPS_UNILIGAS` | `LIGA_ID=edefi` |
| MULTILIGA | `multiliga` | `LIGA_ID=multiliga` |


## Agregar una nueva liga

1. En `configs-por-liga/datos.js`:
   - Añadir el objeto de config en `LIGAS` (leagueId, appName, appId, apiUrl, colorBase, assets, etc.).
   - Si es UNILIGA: añadir el id a `APPS_UNILIGAS`.
   - Si va en MULTILIGA: añadir el id a `LIGAS_DE_APP_MULTILIGA`.
2. Crear assets en `assets/ligas/<id>/` (icon.png, favicon.png).
3. Añadir profile en `eas.json` si es UNILIGA: `production-<id>` con `env: { LIGA_ID: "<id>" }`.


## Colores por liga

Cada liga define `colorBase`: `verde`, `negro`, `azul` o `rojo`. Las clases NativeWind `liga-*` se resuelven automáticamente:

- `bg-liga-600`, `text-liga-500`, `border-liga-700`, etc.
- El splash usa el color derivado de `colorBase`.


## Testing

```bash
LIGA_ID=edefi npm run test:ci      # Recomendado
LIGA_ID=multiliga npm run test:ci
```

Tests de config: `configs-por-liga/__tests__/` (color-base, datos)

### Tests E2E (Maestro)

`npm run start` solo levanta Metro; no compila ni instala la app. Para E2E hay que **compilar e instalar** la app en el emulador/simulador primero:

```bash
# Terminal 1: Metro
LIGA_ID=edefi npm run start

# Terminal 2: compilar e instalar en el emulador (solo la primera vez o tras cambios nativos)
LIGA_ID=edefi npm run android   # Android
# o
LIGA_ID=edefi npm run ios      # iOS

# Cuando la app esté instalada y Metro corriendo:
npm run test:e2e:android       # Android
npm run test:e2e:ios           # iOS
npm run test:e2e               # usa el dispositivo conectado
```

**Importante:** usar `LIGA_ID` en mayúsculas (no `liga_id`).


## Otros comandos

```bash
npm run limpiar          # Limpiar dependencias y cachés
npm run typecheck       # TypeScript
npm run lint            # ESLint
```
