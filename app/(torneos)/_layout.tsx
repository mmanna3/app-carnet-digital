import { Stack } from 'expo-router'

export default function TorneosFlujoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="torneos" />
    </Stack>
  )
}
