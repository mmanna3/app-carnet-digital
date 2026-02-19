import { useState } from 'react'
import { View, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/app/hooks/use-auth'
import CommonStyles from '@/constants/CommonStyles'
import Colores from '@/constants/Colores'
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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Carnet digital</Text>
        <Text style={styles.subtitulo}>
          ¡Bienvenido, delegado! Si no tenés usuario, comunicate con la administración de la liga.
        </Text>

        <TextInput
          style={CommonStyles.input}
          placeholder="Usuario"
          placeholderTextColor="#555"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={CommonStyles.input}
          placeholder="Contraseña"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    // maxWidth: 500,
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  subtitulo: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 30,
    // marginHorizontal: 30,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: Colores.verde,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
})
