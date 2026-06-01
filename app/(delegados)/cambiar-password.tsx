import { useState } from 'react'
import { View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { api } from '@/lib/api/api'
import { CambiarPasswordDTO } from '@/lib/api/clients'
import { useAuth } from '@/lib/hooks/use-auth'
import { BotonUi } from '@/design-system/componentes/boton'
import { Texto } from '@/design-system/componentes/texto'
import { LayoutAsistente } from '@/design-system/layouts/layout-asistente'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'

export default function CambiarPasswordScreen() {
  const params = useLocalSearchParams()
  const usuario = params.usuario as string
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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
    <LayoutAsistente titulo="Cambiar contraseña" onVolver={() => router.back()}>
      <View className="mx-auto w-full max-w-[320px] gap-4 pt-2">
        <Texto variante="cuerpo" className="text-center text-zinc-400">
          Ingresá tu nueva contraseña
        </Texto>

        <CampoTexto placeholder="Usuario" value={usuario} editable={false} />

        <CampoTexto
          placeholder="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!loading}
        />

        <CampoTexto
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        {error ? (
          <Texto variante="cuerpo" className="text-center text-red-400">
            {error}
          </Texto>
        ) : null}

        <BotonUi
          texto={loading ? 'Cambiando contraseña…' : 'Cambiar contraseña'}
          onPress={handleSubmit}
          deshabilitado={loading}
          cargando={loading}
          testID="boton-cambiar-password"
        />
      </View>
    </LayoutAsistente>
  )
}
