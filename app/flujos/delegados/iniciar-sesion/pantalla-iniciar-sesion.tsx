import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/lib/hooks/use-auth'
import { BotonUi } from '@/design-system/componentes/boton'
import { Texto } from '@/design-system/componentes/texto'
import { LayoutAsistente } from '@/design-system/layouts/layout-asistente'
import CampoTexto from '@/app/flujos/fichaje-jugador/campo-texto'

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
        // useProtectedRoute redirige al autenticarse
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
    <LayoutAsistente
      testID="pantalla-login"
      titulo="Inicio de sesión"
      onVolver={() => router.back()}
    >
      <View className="mx-auto w-full max-w-[320px] gap-4 pt-4">
        <Texto variante="cuerpo" className="text-center text-zinc-400">
          Para DTs y Delegados
        </Texto>

        <CampoTexto
          inputTestID="input-usuario"
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <CampoTexto
          inputTestID="input-password"
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {error ? (
          <Texto variante="cuerpo" className="text-center text-red-400">
            {error}
          </Texto>
        ) : null}

        <BotonUi
          testID="boton-iniciar-sesion"
          texto={loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          onPress={handleLogin}
          deshabilitado={loading}
          cargando={loading}
        />

        <TouchableOpacity
          testID="boton-no-registrado"
          onPress={() => router.push('/registro-delegado' as any)}
          className="mt-2"
        >
          <Texto variante="cuerpo" className="text-center text-zinc-400 underline">
            No estoy registrado
          </Texto>
        </TouchableOpacity>
      </View>
    </LayoutAsistente>
  )
}
