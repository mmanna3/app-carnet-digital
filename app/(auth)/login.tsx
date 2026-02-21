import { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/app/hooks/use-auth'
import Boton from '@/components/boton'

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
        router.push('/seleccion-de-equipo')
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
    <View className="flex-1 bg-white justify-center">
      <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-5 z-10">
        <Text className="text-base text-liga-600">← Volver</Text>
      </TouchableOpacity>
      <View className="w-full max-w-[300px] self-center">
        <Text className="text-3xl font-bold text-center text-black">Carnet digital</Text>
        <Text className="text-xl mt-5 mb-8 text-center text-black">
          ¡Bienvenido, delegado! Si no tenés usuario, comunicate con la administración de la liga.
        </Text>

        <TextInput
          className="h-[55px] px-3 rounded border border-[#ddd] mb-3 text-base bg-[#eee]"
          placeholder="Usuario"
          placeholderTextColor="#555"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          className="h-[55px] px-3 rounded border border-[#ddd] mb-3 text-base bg-[#eee]"
          placeholder="Contraseña"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {error ? <Text className="text-red-500 mb-2.5 text-center">{error}</Text> : null}

        <Boton
          texto={loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          onPress={handleLogin}
          deshabilitado={loading}
          cargando={loading}
        />
      </View>
    </View>
  )
}
