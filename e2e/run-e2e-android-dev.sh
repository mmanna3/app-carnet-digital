#!/bin/bash

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

iTermExec() {
  osascript <<EOF
  tell application "iTerm"
    tell current window
      create tab with default profile
      tell current session of current tab
        write text "$1"
      end tell
    end tell
  end tell
EOF
}

# Pestaña 1: mock server HTTP
iTermExec "cd '$ROOT' && node e2e/mock-server.js"

# Pestaña 2: servidor Expo (Metro) con mock server URL inlineada en el bundle
iTermExec "cd '$ROOT' && EXPO_PUBLIC_E2E_API_URL=http://10.0.2.2:3001 LIGA_ID=edefi npm start"

# Pestaña 3: build incremental debug con Expo → abre la app → cuando arrancó, corre Maestro
# npm run android detecta el Metro ya corriendo en :8081, lo reutiliza y termina su proceso
# al instalar y abrir la app → encadenamos test:e2e con &&
iTermExec "cd '$ROOT' && EXPO_PUBLIC_E2E_API_URL=http://10.0.2.2:3001 LIGA_ID=edefi npm run android && npm run test:e2e"

# Mover foco a la primera pestaña nueva
osascript <<EOF
tell application "iTerm"
  tell current window
    select first tab
  end tell
end tell
EOF

