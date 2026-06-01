import { Stack } from 'expo-router'

export default function TorneosLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="torneo-detalle" />
      <Stack.Screen name="zona-detalle" />
    </Stack>
  )
}
