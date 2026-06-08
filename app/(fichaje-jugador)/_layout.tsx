import { Stack } from 'expo-router'

export default function FichajeJugadorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="fichajes" />
    </Stack>
  )
}
