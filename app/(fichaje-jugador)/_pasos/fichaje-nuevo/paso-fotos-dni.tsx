import React, { useState } from 'react'
import { View, Text, Image, ScrollView, ActionSheetIOS, Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Feather } from '@expo/vector-icons'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import Progreso from '@/fichaje-jugador/_components/progreso'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import { Titulo } from '@/design-system/componentes'
function mostrarSelectorImagen(onCamara: () => void, onGaleria: () => void) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ['Cancelar', 'Sacar foto', 'Elegir de galería'], cancelButtonIndex: 0 },
      (index) => {
        if (index === 1) onCamara()
        if (index === 2) onGaleria()
      }
    )
  } else {
    Alert.alert('Seleccionar foto', undefined, [
      { text: 'Sacar foto', onPress: onCamara },
      { text: 'Elegir de galería', onPress: onGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ])
  }
}

function PreviewDni({ uri }: { uri: string | null }) {
  return (
    <View className="w-full h-40 glass rounded-2xl border border-border-glass items-center justify-center overflow-hidden">
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <Feather name="credit-card" size={48} color="#52525b" />
      )}
    </View>
  )
}

const isE2E = !!process.env.EXPO_PUBLIC_E2E_API_URL

async function procesarImagenDni(uri: string): Promise<{ uri: string; base64: string }> {
  const { uri: uriProcesada, base64 } = await ImageManipulator.manipulateAsync(uri, [], {
    compress: 0.8,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  })
  if (!base64) throw new Error('No se pudo procesar la imagen')
  return { uri: uriProcesada, base64 }
}

export default function PasoFotosDni() {
  const {
    dniFrenteUri,
    dniDorsoUri,
    nombreEquipo,
    setDniFrenteUri,
    setDniDorsoUri,
    setDniFrenteBase64,
    setDniDorsoBase64,
    irAlPasoSiguiente,
    irAlPasoAnterior,
  } = useFichajeStore()
  const [errorCamara, setErrorCamara] = useState<string | null>(null)

  const sacarFoto = async (lado: 'frente' | 'dorso') => {
    setErrorCamara(null)
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync()
      if (!permiso.granted) return

      const resultado = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: false,
      })
      if (!resultado.canceled) {
        const asset = resultado.assets[0]
        const { uri, base64 } = await procesarImagenDni(asset.uri)
        if (lado === 'frente') {
          setDniFrenteUri(uri)
          setDniFrenteBase64(base64)
        } else {
          setDniDorsoUri(uri)
          setDniDorsoBase64(base64)
        }
      }
    } catch {
      setErrorCamara('La cámara no está disponible en este dispositivo')
    }
  }

  const elegirImagen = async (lado: 'frente' | 'dorso') => {
    if (isE2E) {
      const b64 =
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI' +
        '////////////////////////////////////////////////////wAALCAAKAAoBAREA' +
        '/8QAFQABAQAAAAAAAAAAAAAAAAAAAAT/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEB' +
        'AAA/AIgH/9k='
      const uri = 'data:image/jpeg;base64,' + b64
      if (lado === 'frente') {
        setDniFrenteUri(uri)
        setDniFrenteBase64(b64)
      } else {
        setDniDorsoUri(uri)
        setDniDorsoBase64(b64)
      }
      return
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    })
    if (!resultado.canceled) {
      const asset = resultado.assets[0]
      const { uri, base64 } = await procesarImagenDni(asset.uri)
      if (lado === 'frente') {
        setDniFrenteUri(uri)
        setDniFrenteBase64(base64)
      } else {
        setDniDorsoUri(uri)
        setDniDorsoBase64(base64)
      }
    }
  }

  const handleVolver = () => {
    setDniFrenteUri(null)
    setDniDorsoUri(null)
    setDniFrenteBase64(null)
    setDniDorsoBase64(null)
    irAlPasoAnterior()
  }

  return (
    <View testID="paso-fotos-dni" className="flex-1 bg-surface">
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={handleVolver} />
      <Progreso />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Titulo>Fotos del DNI</Titulo>
          {nombreEquipo && (
            <Text className="text-zinc-400 text-sm">
              Fichándose en <Text className="font-bold text-zinc-100">{nombreEquipo}</Text>
            </Text>
          )}
        </View>

        <View className="gap-6">
          <View className="gap-3">
            <Text className="text-zinc-400 text-sm font-medium">Frente del DNI</Text>
            <PreviewDni uri={dniFrenteUri} />
            <BotonWizard
              testID="boton-seleccionar-frente"
              primario={false}
              texto={dniFrenteUri ? 'Cambiar' : 'Seleccionar'}
              icono="camera"
              onPress={() =>
                mostrarSelectorImagen(
                  () => sacarFoto('frente'),
                  () => elegirImagen('frente')
                )
              }
            />
          </View>

          <View className="gap-3">
            <Text className="text-zinc-400 text-sm font-medium">Dorso del DNI</Text>
            <PreviewDni uri={dniDorsoUri} />
            <BotonWizard
              testID="boton-seleccionar-dorso"
              primario={false}
              texto={dniDorsoUri ? 'Cambiar' : 'Seleccionar'}
              icono="camera"
              onPress={() =>
                mostrarSelectorImagen(
                  () => sacarFoto('dorso'),
                  () => elegirImagen('dorso')
                )
              }
            />
          </View>

          {errorCamara && <Text className="text-red-400 text-sm text-center">{errorCamara}</Text>}

          <BotonWizard
            testID="boton-subir-dni"
            texto="Subir"
            icono="upload"
            onPress={() => irAlPasoSiguiente()}
            deshabilitado={!dniFrenteUri || !dniDorsoUri}
          />
        </View>
      </ScrollView>
    </View>
  )
}
