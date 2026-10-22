import { Stack } from 'expo-router'

export default function ArbitrosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="registro-arbitro" />
    </Stack>
  )
}
