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

# Pestaña 2: Metro bundler (con mock server URL inlineada en el bundle)
iTermExec "cd '$ROOT' && EXPO_PUBLIC_E2E_API_URL=http://10.0.2.2:3001 LIGA_ID=edefi npm start"

# Pestaña 3: build release con Gradle → cuando termina, corre Maestro
# .env: Expo CLI carga .env del project root al hacer export:embed; sin esto la app usa apiUrl de producción
iTermExec "cd '$ROOT' && echo 'EXPO_PUBLIC_E2E_API_URL=http://10.0.2.2:3001' > .env && echo 'LIGA_ID=edefi' >> .env && cd android && rm -rf app/build .cxx && EXPO_PUBLIC_E2E_API_URL=http://10.0.2.2:3001 LIGA_ID=edefi ./gradlew assembleRelease --no-daemon && adb install -r app/build/outputs/apk/release/app-release.apk && cd '$ROOT' && npm run test:e2e"

# Mover foco a la primera pestaña nueva
osascript <<EOF
tell application "iTerm"
  tell current window
    select first tab
  end tell
end tell
EOF

# Cerrar la pestaña original (donde se ejecutó npm run e2e)
osascript <<EOF
tell application "iTerm"
  tell current window
    tell current session
      close
    end tell
  end tell
end tell
EOF
