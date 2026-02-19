# Plan de mejoras

Análisis del estado actual y roadmap de mejoras para escalar la aplicación.

---

## 0. Bugs / problemas activos — corregir ya

### 0a. `QueryClient` se recrea en cada render

**Archivo:** `app/_layout.tsx:81`

El `QueryClient` está instanciado _dentro_ de `RootLayoutNav()`. Se destruye y recrea en cada re-render, invalidando toda la caché de React Query.

**Fix:** declararlo fuera del componente o con `useState`.

---

### 0b. `window.fetch` en lugar de `fetch` global

**Archivo:** `app/api/http-client-wrapper.ts:33`

`window.fetch` no existe en React Native (es Web). En Android falla silenciosamente. Tiene que ser `fetch(url, init)` (el global de React Native).

---

### 0c. `scheme: "myapp"` — placeholder por defecto

**Archivo:** `app.json:8`

Es el valor placeholder que genera Expo por defecto. Si hay otra app con el mismo scheme en el dispositivo, los deep links no funcionan.

**Fix:** cambiarlo a algo único, ej. `carnet-digital`.

---

### 0d. Dependencias redundantes y scripts deprecados

- `react-native-html-to-pdf` — ya está `expo-print` que hace lo mismo, es oficial y no requiere prebuild manual.
- `react-native-fs` — ya está `expo-file-system` (o puede agregarse). Mismo argumento.
- Scripts `build:android` / `build:ios` en `package.json` usan el viejo `expo build` que ya no existe. Confunden y se pueden borrar.

---

## 1. Tooling — base para todo lo demás

### 1a. ESLint

No hay ningún linter configurado. Para una app en crecimiento es lo primero.

```bash
npx expo lint  # configura eslint-config-expo automáticamente
```

`eslint-config-expo` incluye reglas para React Native, TypeScript y Expo Router.
Extensión recomendada: `eslint-plugin-react-query` para detectar mal uso de TanStack Query.

### 1b. Prettier

Consistencia de formato. Se integra con ESLint.

### 1c. Husky + lint-staged (opcional pero recomendable)

Corre ESLint y Prettier automáticamente en cada commit.

---

## 2. NativeWind — design system + theming multi-liga en un solo paso ✅ HECHO

**NativeWind** es Tailwind CSS para React Native. Reemplaza `StyleSheet.create({...})` con clases `className`, exactamente igual que en web. Internamente sigue compilando a StyleSheet, por lo que no hay overhead de runtime.

```tsx
// Antes (StyleSheet)
<View style={styles.boton}>
  <Text style={styles.texto}>Buscar</Text>
</View>

// Con NativeWind
<View className="bg-primary px-4 py-3 rounded-lg">
  <Text className="text-white font-semibold">Buscar</Text>
</View>
```

### Por qué resuelve dos problemas a la vez

El problema de los colores dispersos (punto original del plan) y la arquitectura multi-liga (punto 5) tienen la misma solución con NativeWind v4: **CSS variables**.

Los colores de cada liga se definen como variables CSS que NativeWind inyecta en runtime desde la configuración de liga. Todos los componentes usan clases como `bg-primary` o `text-secondary` sin saber de qué liga se trata — el valor de `primary` cambia según la liga activa.

```css
/* global.css — valores por defecto (liga actual: LUEFI) */
:root {
  --color-primary: #01aa59;
  --color-primary-dark: #007a3f;
  --color-secondary: #0038ba;
  --color-accent: #3ea334;
}
```

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
    },
  },
}
```

En runtime, al arrancar la app se lee la configuración de liga (de `Constants.expoConfig.extra`) y se setean las variables CSS — mismo mecanismo que usamos para `apiUrl`.

### Limitaciones a tener en cuenta

- No es 100% igual a web Tailwind: no hay `grid`, algunas utilidades de layout web no existen en RN.
- `hover:`, `focus:` y otras pseudo-clases no aplican en nativo (sí en el target web).
- `shadow-*` y `border-*` tienen comportamiento diferente entre iOS y Android.

### Plan de migración

1. Instalar NativeWind v4 + configurar `tailwind.config.js` y `global.css`.
2. Definir los colores semánticos como CSS variables (`primary`, `secondary`, etc.).
3. Reemplazar `constants/Colores.ts` por las variables CSS.
4. Migrar `StyleSheet.create` a `className` pantalla por pantalla (se puede hacer gradualmente — ambos sistemas conviven).
5. Al implementar multi-liga (punto 5), los colores de cada liga simplemente setean distintos valores para las mismas variables.

---

## 3. Query key factory centralizado

Manejar claves de React Query como strings sueltos (`['carnets', equipoSeleccionadoId]`) escala mal: se invalida la caché incorrectamente, se duplican keys, etc.

**Solución:** una factory centralizada:

```typescript
// app/api/query-keys.ts
export const queryKeys = {
  carnets: {
    all: ['carnets'] as const,
    byEquipo: (id: number) => ['carnets', id] as const,
  },
  jugadores: {
    pendientes: (id: number) => ['jugadores', 'pendientes', id] as const,
  },
  torneos: {
    all: ['torneos'] as const,
    byEquipo: (id: number) => ['torneos', id] as const,
  },
}
```

---

## 4. Dependencias — actualizar / agregar / sacar

| Paquete                    | Ahora      | Acción                                             |
| -------------------------- | ---------- | -------------------------------------------------- |
| `typescript`               | `~5.3.3`   | Actualizar a `~5.7.x`                              |
| `expo`                     | `~52.0.38` | Evaluar SDK 53                                     |
| `react-native-html-to-pdf` | `^0.12.0`  | **Eliminar** — reemplazado por `expo-print`        |
| `react-native-fs`          | `^2.20.0`  | **Eliminar** — reemplazado por `expo-file-system`  |
| `nativewind`               | —          | **Agregar** (punto 2)                              |
| `tailwindcss`              | —          | **Agregar** (punto 2, devDependency)               |
| `expo-file-system`         | —          | **Agregar** (oficial Expo)                         |
| `expo-image-picker`        | —          | **Agregar** (necesario para el wizard de fichaje)  |
| `expo-camera`              | —          | Opcional si se necesita control fino de cámara     |
| `zod`                      | —          | **Agregar** (validación de schemas para el wizard) |
| `react-hook-form`          | —          | **Agregar** (manejo de formularios para el wizard) |

---

## 5. Arquitectura multi-liga (white-label)

El approach oficial de Expo es **`app.config.ts` dinámico + variable de entorno `LEAGUE_ID`**.

### 5a. Estructura de archivos

```
app-carnet-digital/
├── app.config.ts              ← reemplaza app.json
├── league-configs/
│   ├── types.ts               ← interfaz LeagueConfig
│   ├── luefi.ts
│   ├── liga-rosario.ts
│   └── liga-cordoba.ts
└── assets/
    └── leagues/
        ├── luefi/
        │   ├── icon.png         (1024×1024)
        │   ├── splash.png       (2048×2048)
        │   ├── adaptive-icon.png
        │   └── logo.png
        └── liga-rosario/
            └── ...
```

### 5b. Estructura del archivo de configuración por liga

```typescript
// league-configs/luefi.ts
export const luefiConfig: LeagueConfig = {
  // Identidad
  leagueId: 'luefi',
  leagueName: 'LUEFI',
  leagueDisplayName: 'Liga Uruguaya de Fútbol Infantil',

  // App stores — cada liga necesita IDs únicos
  appId: 'com.blueservant.carnetdigital.luefi',
  expoSlug: 'carnet-digital-luefi',
  easProjectId: '72d45eb4-...', // cada liga necesita su propio proyecto EAS

  // Deep linking
  scheme: 'carnet-luefi',

  // Assets
  icon: './assets/leagues/luefi/icon.png',
  splashImage: './assets/leagues/luefi/splash.png',
  adaptiveIconForeground: './assets/leagues/luefi/adaptive-icon.png',

  // Marca visual
  colors: {
    primary: '#01aa59',
    primaryDark: '#007a3f',
    secondary: '#0038ba',
    accent: '#3ea334',
    splashBackground: '#3ea334',
  },

  // API
  apiUrl: 'https://luefi.liga.com.ar',

  // Nombre en el store
  appName: 'Carnet Digital LUEFI',

  // iOS
  ios: {
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: 'Necesitamos acceso a tu cámara para la foto del carnet',
      NSPhotoLibraryUsageDescription: 'Necesitamos acceso a tus fotos para el carnet',
    },
  },
}
```

### 5c. `app.config.ts` dinámico

```typescript
import { ExpoConfig } from 'expo/config'
import { luefiConfig } from './league-configs/luefi'

const LEAGUE_ID = process.env.LEAGUE_ID ?? 'luefi'
const configs = { luefi: luefiConfig }
const league = configs[LEAGUE_ID]

export default (): ExpoConfig => ({
  name: league.appName,
  slug: league.expoSlug,
  scheme: league.scheme,
  // ... resto dinámico
  extra: {
    leagueId: LEAGUE_ID,
    leagueName: league.leagueDisplayName,
    apiUrl: league.apiUrl,
    colors: league.colors,
    eas: { projectId: league.easProjectId },
  },
})
```

### 5d. `eas.json` con perfiles por liga

```json
{
  "build": {
    "production-luefi": {
      "autoIncrement": true,
      "env": { "LEAGUE_ID": "luefi" }
    },
    "production-rosario": {
      "autoIncrement": true,
      "env": { "LEAGUE_ID": "liga-rosario" }
    }
  }
}
```

Build: `eas build --platform ios --profile production-luefi`

### 5e. Consumo en runtime

```typescript
// app/config/league.ts  (reemplaza env.ts)
import Constants from 'expo-constants'
export const leagueConfig = Constants.expoConfig?.extra as LeagueRuntimeConfig
```

### 5f. Consideraciones Apple / Google para evitar rechazo (guideline 4.3 Spam)

- Cada app debe tener diferente nombre, ícono y colores → cubierto por la arquitectura.
- Cada app debe tener su propio `bundleIdentifier` → cubierto.
- Cada app registrada con una cuenta de desarrollador distinta es más seguro si las ligas son organizaciones independientes. Con la misma cuenta son más visibles como "la misma app".
- Incluir el nombre de la liga en las capturas de pantalla y descripción del store.
- 10.000 usuarios activos por app es completamente legítimo — Apple considera eso una base de usuarios real.
- Incluir en `infoPlist` todos los permisos que se usen (especialmente cámara para el fichaje) antes de mandar a review.

---

## 6. Nuevas features: usuarios sin login

### 6a. Auth guard para rutas públicas

Agregar un grupo `(public)` accesible sin autenticación y actualizar el guard en `_layout.tsx`:

```
app/
├── (auth)/
├── (public)/
│   ├── torneos/
│   │   ├── index.tsx
│   │   └── [torneoId].tsx
│   └── fichaje/
│       ├── paso-1-datos.tsx
│       ├── paso-2-domicilio.tsx
│       ├── paso-3-contacto.tsx
│       ├── paso-4-fotos.tsx
│       ├── paso-5-equipo.tsx
│       └── paso-6-confirmacion.tsx
└── (tabs)/
```

### 6b. Wizard de fichaje (6 pasos)

El estado del wizard se maneja con un Zustand store temporal `useFichajeStore` que se limpia al completar o cancelar.

Para las fotos (paso 4): `expo-image-picker` es la opción recomendada:

- Permite elegir de galería o tomar foto directamente
- Funciona en Expo Go sin dev client

Para validación por paso: `react-hook-form` + `zod`.

---

## Resumen priorizado

| #     | Cambio                                              | Urgencia                   |
| ----- | --------------------------------------------------- | -------------------------- |
| **0** | Fix `QueryClient` en `_layout.tsx`                  | **Ya**                     |
| **0** | Fix `window.fetch` → `fetch`                        | **Ya**                     |
| **0** | Fix `scheme: "myapp"`                               | **Ya**                     |
| **0** | Sacar dependencias redundantes y scripts deprecados | **Ya**                     |
| 1     | ESLint + Prettier                                   | Alta                       |
| 1     | NativeWind — design system + theming multi-liga     | Alta                       |
| 1     | Query key factory                                   | Media                      |
| 2     | `app.config.ts` + league configs (multi-liga)       | Alta si está en el roadmap |
| 2     | EAS profiles por liga                               | Alta si está en el roadmap |
| 3     | Auth guard para rutas públicas                      | Media                      |
| 3     | Wizard de fichaje                                   | Media                      |
| 3     | Torneos públicos                                    | Media                      |
