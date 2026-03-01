#!/usr/bin/env bash
set -e

export PATH="$PATH:$HOME/.maestro/bin"

cleanup() {
  [ -n "${MOCK_PID:-}" ] && kill $MOCK_PID 2>/dev/null || true
  # Workaround: crashpad_handler no recibe señales al cerrar el emulador y provoca
  # "stop: Not implemented" + hang infinito. https://github.com/ReactiveCircus/android-emulator-runner/issues/385
  killall -INT crashpad_handler 2>/dev/null || true
}
trap cleanup EXIT

# .env con URL del mock (10.0.2.2 = localhost del host desde el emulador)
echo "EXPO_PUBLIC_E2E_API_URL=http://10.0.2.2:3001" > .env
echo "LIGA_ID=edefi" >> .env

# Mock server en background
node e2e/mock-server.js &
MOCK_PID=$!

# Build APK release con la URL del mock embebida en el bundle
chmod +x android/gradlew
cd android && EXPO_PUBLIC_E2E_API_URL=http://10.0.2.2:3001 LIGA_ID=edefi ./gradlew assembleRelease --no-daemon && cd ..

# Instalar APK en el emulador
adb install -r android/app/build/outputs/apk/release/app-release.apk

# Ejecutar Maestro (pretest:e2e inyecta las fotos via adb automáticamente)
npm run test:e2e
