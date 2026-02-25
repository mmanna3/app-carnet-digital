import { useState } from 'react'
import { View, TextInput, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { api } from '@/lib/api/api'
import { CambiarPasswordDTO } from '@/lib/api/clients'
import { useAuth } from '@/lib/hooks/use-auth'
import Boton from '@/components/boton'

export default function CambiarPasswordScreen() {
  const params = useLocalSearchParams()
  const usuario = params.usuario as string
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuthState } = useAuth()

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Por favor complete todos los campos')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      setError('')
      setLoading(true)
      const request = new CambiarPasswordDTO({
        usuario,
        passwordNuevo: newPassword,
      })

      const response = await api.cambiarPassword(request)

      if (response.exito) {
        setAuthState(response.token!, usuario)
        // No navegar: useProtectedRoute en _layout.tsx redirige automáticamente
      } else {
        setError(response.error || 'Hubo un error al cambiar la contraseña')
      }
    } catch (err) {
      setError('Error comunicándose con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex-1 justify-center gap-5">
        <Text className="text-2xl font-bold text-black text-center">Cambiar Contraseña</Text>
        <Text className="text-base text-black text-center mb-5">
          Por favor ingrese su nueva contraseña
        </Text>

        <TextInput
          className="h-[55px] px-3 rounded border border-[#ddd] mb-3 text-base bg-[#eee]"
          placeholder="Usuario"
          placeholderTextColor="#555"
          value={usuario}
          editable={false}
        />

        <TextInput
          className="h-[55px] px-3 rounded border border-[#ddd] mb-3 text-base bg-[#eee]"
          placeholder="Nueva Contraseña"
          placeholderTextColor="#555"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          className="h-[55px] px-3 rounded border border-[#ddd] mb-3 text-base bg-[#eee]"
          placeholder="Confirmar Nueva Contraseña"
          placeholderTextColor="#555"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        {error ? <Text className="text-red-500 text-center">{error}</Text> : null}

        <Boton
          texto={loading ? 'Cambiando Contraseña...' : 'Cambiar Contraseña'}
          onPress={handleSubmit}
          deshabilitado={loading}
          cargando={loading}
          testID="boton-cambiar-password"
        />
      </View>
    </View>
  )
}
