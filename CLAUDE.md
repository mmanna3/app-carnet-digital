# CLAUDE.md

Este archivo guía a Claude Code al trabajar con el código de este repositorio.

## Descripción del proyecto

App React Native + Expo **SDK 54** para gestionar carnets digitales de jugadores. Compatible con **Expo Go** (App Store, SDK 54) vía QR. Los delegados inician sesión, eligen su equipo y ven/buscan carnets con el estado de registro. Soporta iOS y Android (sin target web).

**Stack:** Expo SDK 54, React Native 0.81, React 19.1, expo-router ~6.0. iOS mínimo 15.1.

## Comandos

**Importante:** Todos los comandos requieren `LIGA_ID` (start, build, deploy). Si no está definido, fallan.

```bash
# Desarrollo
LIGA_ID=edefi npm start           # UNILIGA — escanear QR con Expo Go SDK 54
LIGA_ID=edefi npx expo start -c   # Con cache limpia
LIGA_ID=edefi npx expo start --tunnel  # Si LAN falla (iPhone físico)
LIGA_ID=multiliga npm start       # MULTILIGA (selección de liga)
LIGA_ID=edefi npm run start:dev   # Con dev client

# Usar API de producción en dev (liga.apiUrl en vez de local):
EXPO_PUBLIC_USE_PROD_API=true LIGA_ID=edefi npm start
LIGA_ID=edefi npm run ios         # Simulador iOS
LIGA_ID=edefi npm run android     # Emulador Android

# Testing
LIGA_ID=edefi npm run typecheck   # TypeScript
LIGA_ID=edefi npm run test:ci     # Jest
npm run e2e                  # Maestro E2E (Android, orquestado)
npm run e2e:ios              # Maestro E2E (iOS, orquestado)

# Build y deploy
LIGA_ID=edefi npm run ios:build
LIGA_ID=edefi npm run ios:deploy
LIGA_ID=multiliga npm run ios:build   # App MULTILIGA

# Mantenimiento
npm run limpiar          # Limpiar dependencias y cachés
```

**Workflow de deploy:** subir versión en `app.config.ts`, luego build → deploy con el mismo `LIGA_ID`.

## Arquitectura

### UNILIGA vs MULTILIGA

- **UNILIGA:** Una app por liga (un ícono en el store). Liga fija en build. `APPS_UNILIGAS = ['edefi']`.
- **MULTILIGA:** Una app "Carnet Digital" con varias ligas. Usuario selecciona liga al inicio. `LIGAS_DE_APP_MULTILIGA = ['luefi']`.

### Capas del código

| Capa | Ruta | Rol |
|------|------|-----|
| Rutas (Expo Router) | `app/(home)/`, `app/(fichaje-jugador)/`, `app/(delegados)/`, `app/(torneos)/` | Pantallas navegables por flujo |
| Colocated por flujo | `_components/`, `_pasos/`, `_registro-delegado/`, etc. | UI y pasos de wizard (no son rutas) |
| Design system | `app/design-system/` | Tokens, componentes UI, layouts |
| Lógica compartida | `app/logica-compartida/` | API, hooks, config, utilidades, **constantes de rutas** |

Expo Router ignora `design-system/`, `logica-compartida/` y carpetas colocated cuyo segmento empieza con `_` seguido de `/` (p. ej. `_components/`, `_pasos/`). **No** excluye `_layout.tsx`.

### Archivos clave

- `configs-por-liga/datos.js` — Fuente única: LIGAS, APPS_UNILIGAS, LIGAS_DE_APP_MULTILIGA, CONFIG_APP_MULTILIGA
- `configs-por-liga/color-base.js` — Color base para Tailwind y splash
- `app.config.ts` — Config de Expo según LIGA_ID
- `app/logica-compartida/constantes/rutas.ts` — **`RUTAS`**: paths tipados para navegación (`router.push(RUTAS.HOME)`, etc.)
- `app/logica-compartida/config/liga.ts` — `getConfigLiga()`, `useConfigLiga()`
- `app/logica-compartida/hooks/use-liga-store.ts` — Liga seleccionada (MULTILIGA); key `liga-storage`
- `app/(home)/seleccion-de-liga.tsx` — Selección de liga (MULTILIGA)
- `assets/ligas/<id>/` — Assets por liga

**Colores liga:** Clases NativeWind `liga-*`: `bg-liga-600`, `text-liga-500`, etc.

### Routing (Expo Router)

```
app/
├── _layout.tsx, index.tsx, +not-found.tsx
├── design-system/, logica-compartida/
├── (home)/                     # /home, /seleccion-de-liga
├── (fichaje-jugador)/          # /fichajes (+ _pasos, _components)
├── (delegados)/                # login, tabs (inicio), fichaje/registro delegado
│   └── (inicio)/               # tabs: mis-jugadores, buscar, pendientes
└── (torneos)/torneos/          # /torneos/*
```

Los route groups `(home)`, `(fichaje-jugador)`, `(delegados)`, `(torneos)` y `(inicio)` no aparecen en la URL.

**Navegación:** usar `RUTAS` de `@/logica-compartida/constantes/rutas` (alias `@/constants/rutas`).

**Auth guard** (`app/_layout.tsx`): MULTILIGA sin liga → `RUTAS.SELECCION_LIGA`. No autenticado → `RUTAS.HOME`. Autenticado sin equipo → `RUTAS.SELECCION_EQUIPO`.

### State Management

**Zustand** (persistidos) en `logica-compartida/hooks/`:

- `use-auth.ts` — key `auth-storage`
- `use-equipo-store.ts` — key `equipo-storage`
- `use-liga-store.ts` — key `liga-storage`

**TanStack React Query** para estado del servidor.

### API Layer

- `logica-compartida/api/clients.ts` — Cliente NSwag **auto-generado**. No editar.
- `logica-compartida/api/http-client-wrapper.ts` — JWT; 401 → logout.
- `logica-compartida/api/api.ts` — Proxy con `getConfigLiga().apiUrl`.

Regenerar contrato: script `generar-contrato-be-en-app.sh` en el monorepo.

### Design system

- `design-system/componentes/` — `Texto`, `BotonUi`, `PantallaPublica`, etc.
- `design-system/tokens/` — TOKENS, fuentes, tema agrupador
- `design-system/layouts/layout-asistente.tsx` — shell oscuro para wizards

`Boton` / `BotonUi` en `design-system/componentes/boton.tsx` — variante `tema="liga"` para acentos de liga en formularios claros.

### Path aliases (`tsconfig.json`)

- `@/home/*` → `app/(home)/*`
- `@/fichaje-jugador/*` → `app/(fichaje-jugador)/*`
- `@/delegados/*` → `app/(delegados)/*`
- `@/inicio-delegados/*` → `app/(delegados)/(inicio)/*`
- `@/torneos/*` → `app/(torneos)/torneos/*`
- `@/design-system/*` → `app/design-system/*`
- `@/logica-compartida/*` → `app/logica-compartida/*`
- `@/lib/*` → `app/logica-compartida/*` (compat)
- `@/constants/*` → `app/logica-compartida/constantes/*` (incluye `rutas.ts`)
