import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/lib/hooks/use-auth'
import Boton from '@/components/boton'
import CampoTexto from '@/components/fichajes/campo-texto'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña')
      return
    }

    try {
      setError('')
      setLoading(true)
      const respuesta = await login(username, password)

      if (respuesta.exito) {
        // No navegar: useProtectedRoute en _layout.tsx redirige automáticamente
        // cuando isAuthenticated pasa a true (evita duplicar pantalla en iOS)
      } else {
        if (respuesta.error === 'El usuario debe cambiar la contraseña') {
          router.push({
            pathname: '/cambiar-password',
            params: { usuario: username },
          })
        }
        setError(
          respuesta.error || 'Hubo en error no controlado. Comunicate con la administración.'
        )
      }
    } catch (err) {
      setError('Error comunicándose con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View testID="pantalla-login" className="flex-1 bg-white justify-center">
      <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-5 z-10">
        <Text className="text-base text-liga-600">← Volver</Text>
      </TouchableOpacity>
      <View className="w-full max-w-[300px] self-center">
        <Text className="text-3xl font-bold text-center text-black">Inicio de sesión</Text>
        <Text className="text-xl mt-5 mb-8 text-center text-black">
          Para DTs y Delegados
        </Text>

        <View className="mb-3">
          <CampoTexto
            inputTestID="input-usuario"
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View className="mb-3">
          <CampoTexto
            inputTestID="input-password"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {error ? <Text className="text-red-500 mb-2.5 text-center">{error}</Text> : null}

        <Boton
          testID="boton-iniciar-sesion"
          texto={loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          onPress={handleLogin}
          deshabilitado={loading}
          cargando={loading}
        />

        <TouchableOpacity
          testID="boton-no-registrado"
          onPress={() => router.push('/registro-delegado' as any)}
          className="mt-6"
        >
          <Text className="text-center text-gray-500 text-sm underline">No estoy registrado</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
