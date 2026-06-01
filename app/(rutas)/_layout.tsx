import { Stack } from 'expo-router'
import HeaderMenu from '@/app/flujos/delegados/delegados-home/delegados-menu/header-menu'

export default function RutasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="torneos" options={{ headerShown: false }} />
      <Stack.Screen name="fichajes" options={{ headerShown: false }} />
      <Stack.Screen name="registro-delegado" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(delegados-home)"
        options={{
          headerShown: false,
          title: 'Inicio',
        }}
      />
      <Stack.Screen
        name="fichaje-delegado"
        options={{
          title: 'Fichar jugador',
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: { backgroundColor: '#0a0a0b' },
          headerTintColor: '#e4e4e7',
          headerTitleStyle: { color: '#e4e4e7' },
          headerRight: () => <HeaderMenu />,
        }}
      />
      <Stack.Screen
        name="seleccion-de-liga"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="seleccion-de-equipo"
        options={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />
    </Stack>
  )
}
