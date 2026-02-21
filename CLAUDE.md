# CLAUDE.md

Este archivo guía a Claude Code al trabajar con el código de este repositorio.

## Descripción del proyecto

App React Native + Expo para gestionar carnets digitales de jugadores. Los delegados inician sesión, eligen su equipo y ven/buscan carnets con el estado de registro. Soporta iOS, Android y Web.

## Comandos

**Importante:** Todos los comandos requieren `LIGA_ID` (start, build, deploy). Si no está definido, fallan.

```bash
# Desarrollo
LIGA_ID=edefi npm start           # UNILIGA (app EDeFI)
LIGA_ID=multiliga npm start       # MULTILIGA (selección de liga)
LIGA_ID=edefi npm run start:dev   # Con dev client
LIGA_ID=edefi npm run ios         # Simulador iOS
LIGA_ID=edefi npm run android     # Emulador Android

# Testing
LIGA_ID=edefi npm run test:ci     # Jest
npm run test:e2e                    # Maestro E2E

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

### Archivos clave

- `configs-por-liga/datos.js` — Fuente única: LIGAS, APPS_UNILIGAS, LIGAS_DE_APP_MULTILIGA, CONFIG_APP_MULTILIGA
- `configs-por-liga/color-base.js` — Color base para Tailwind y splash (verde→green, negro→gray, etc.)
- `app.config.ts` — Config de Expo según LIGA_ID (uniliga o multiliga)
- `app/config/liga.ts` — Config en runtime: `getConfigLiga()`, `useConfigLiga()`. UNILIGA: desde extra. MULTILIGA: desde useLigaStore + ligasDisponibles
- `app/hooks/use-liga-store.ts` — Liga seleccionada (MULTILIGA); key `liga-storage`
- `app/seleccion-de-liga.tsx` — Pantalla de selección de liga (MULTILIGA)
- `assets/ligas/<id>/` — Assets por liga (icon.png, favicon.png)

**Colores liga:** Cada liga define `colorBase` (verde, negro, azul, rojo). Clases NativeWind `liga-*`: `bg-liga-600`, `text-liga-500`, etc.

### Routing (Expo Router — file-based)

```
app/
├── _layout.tsx                  # Root layout: auth guard + QueryClient
├── (auth)/                      # Rutas sin auth
│   ├── login.tsx
│   └── cambiar-password.tsx
├── (tabs)/                     # App principal (requiere auth + equipo)
│   ├── mis-jugadores.tsx
│   ├── buscar.tsx
│   └── pendientes.tsx
├── seleccion-de-liga.tsx       # Selección de liga (MULTILIGA, antes de login)
└── seleccion-de-equipo.tsx     # Modal de selección de equipo
```

**Auth guard:** MULTILIGA sin liga → seleccion-de-liga. No autenticado → login. Autenticado sin equipo → seleccion-de-equipo.

### State Management

**Zustand stores** (persistidos):

- `app/hooks/use-auth.ts` — token, usuario; key `auth-storage`
- `app/hooks/use-equipo-store.ts` — equipo seleccionado; key `equipo-storage`
- `app/hooks/use-liga-store.ts` — liga seleccionada (MULTILIGA); key `liga-storage`

**TanStack React Query** para estado del servidor.

### API Layer

- `app/api/clients.ts` — Cliente NSwag/OpenAPI **auto-generado**. No editar.
- `app/api/http-client-wrapper.ts` — Interceptor JWT. 401 → logout.
- `app/api/api.ts` — Proxy que usa `getConfigLiga().apiUrl`. En MULTILIGA, la API cambia según la liga seleccionada.

### Componentes clave

- `app/components/carnet.tsx` — Tarjeta de jugador
- `components/boton.tsx` — Botón unificado
- `app/components/header-menu.tsx` — Menú (Cambiar liga en MULTILIGA, Cambiar equipo, Cerrar sesión)

### Path alias

`@/*` resuelve a la raíz del repo.
