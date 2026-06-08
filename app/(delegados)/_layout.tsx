import { Stack } from 'expo-router'
import HeaderMenu from '@/delegados/_components/header-menu'

export default function DelegadosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="inicio-de-sesion" />
      <Stack.Screen name="cambiar-password" />
      <Stack.Screen name="(inicio)" />
      <Stack.Screen
        name="seleccion-de-equipo"
        options={{
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="registro-delegado" />
      <Stack.Screen
        name="fichaje-delegado"
        options={{
          title: 'Fichar jugador',
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: { backgroundColor: '#0a0a0b' },
          headerTintColor: '#e4e4e7',
          headerTitleStyle: { color: '#e4e4e7' },
          headerShown: true,
          headerRight: () => <HeaderMenu />,
        }}
      />
    </Stack>
  )
}
