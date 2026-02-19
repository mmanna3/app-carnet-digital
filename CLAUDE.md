# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native + Expo app for managing digital sports player registration cards ("carnets"). Delegates log in, select their team, and view/search player cards with their registration status. Targets iOS, Android, and Web.

## Commands

```bash
# Development
npm start                # Start Expo dev server
npm run start:dev        # Start with dev client
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator

# Testing
npm test                 # Jest (watch mode)
npm run test:e2e         # Maestro E2E tests (HTML output)

# Build & Deploy
npm run ios:build        # EAS build for iOS
npm run ios:deploy       # Deploy to App Store
npm run android:build    # EAS build for Android
npm run android:deploy   # Deploy to Play Store

# Maintenance
npm run limpiar          # Clean dependencies and caches
```

**Deployment workflow** (README): bump version in `app.json`, then run build → deploy.

## Architecture

### Routing (Expo Router — file-based)

```
app/
├── _layout.tsx                  # Root layout: auth guard + QueryClient provider
├── (auth)/                      # Unauthenticated routes
│   ├── login.tsx
│   └── cambiar-password.tsx     # Forced password change on first login
├── (tabs)/                      # Main app (requires auth + team selection)
│   ├── mis-jugadores.tsx        # Active players for selected team
│   ├── buscar.tsx               # Public search by team code; generates PDFs
│   └── pendientes.tsx           # Pending/rejected/unpaid registrations
└── seleccion-de-equipo.tsx      # Team selection modal (blocks access to tabs)
```

**Auth guard** in `app/_layout.tsx`: uses `useSegments()` to redirect unauthenticated users to login, and authenticated users without a team to `seleccion-de-equipo`.

### State Management

**Zustand stores** (persisted to device storage):
- `app/hooks/use-auth.ts` — token, username, isAuthenticated; key `auth-storage`
- `app/hooks/use-equipo-store.ts` — selected team id/name; key `equipo-storage`

**TanStack React Query** for server state:
- `app/api/custom-hooks/use-api-query.tsx` — wraps `useQuery` with 2 retries, no refetch on focus, optional data transform
- `app/api/custom-hooks/use-api-mutation.tsx` — wraps `useMutation` with error parsing

### API Layer

- `app/api/clients.ts` — **auto-generated** NSwag/OpenAPI client (~99KB). Do not edit manually; re-generate from Swagger if the backend changes.
- `app/api/http-client-wrapper.ts` — Axios interceptor that injects JWT Bearer token. Public routes (`/api/Auth/login`, `/api/Publico`) skip auth. 401 responses trigger logout + redirect to login.
- `app/config/env.ts` — API base URL (`https://luefi.liga.com.ar`). `__DEV__` flag available for dev/prod branching.

### Player Status

Defined in `app/types/estado-jugador.ts`. States: `FichajePendienteDeAprobacion`, `FichajeRechazado`, `Activo`, `Suspendido`, `Inhabilitado`, `AprobadoPendienteDePago`. Each has a color mapping used throughout the UI.

### PDF Generation

`app/utils/pdfGenerator.ts` — Builds an HTML template with player cards (3×3 grid, 9 per page), sorted by birth date. Uses `expo-print` to render and `expo-sharing` to share. Called from the `buscar` tab.

### Key Components

- `app/components/carnet.tsx` — Reusable player card (photo, DNI, name, birth date, category, optional status badge)
- `components/boton.tsx` — Unified button with loading/disabled states
- `app/components/header-menu.tsx` — Tab header popup menu (logout, etc.)

### Constants

- `constants/Colores.ts` — Brand colors (primary green `#01aa59`, primary blue `#0038ba`)
- `constants/CommonStyles.ts` — Shared input field styles

### Path Alias

`@/*` resolves to the repository root (configured in `tsconfig.json`).
