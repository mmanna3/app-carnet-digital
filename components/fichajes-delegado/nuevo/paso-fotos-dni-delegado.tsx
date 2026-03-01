import React, { useState } from 'react'
import { View, Text, Image, ScrollView, ActionSheetIOS, Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Feather } from '@expo/vector-icons'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import CabeceraDelegado from '../cabecera-delegado'
import ProgresoDelegado from '../progreso-delegado'
import BotonWizard from '@/components/fichajes/boton-wizard'

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
    <View className="w-full h-40 bg-white rounded-2xl shadow-sm border-2 border-gray-200 items-center justify-center overflow-hidden">
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <Feather name="credit-card" size={48} color="#d1d5db" />
      )}
    </View>
  )
}

const isE2E = !!process.env.EXPO_PUBLIC_E2E_API_URL

export default function PasoFotosDniDelegado() {
  const {
    dniFrenteUri,
    dniDorsoUri,
    nombreClub,
    setDniFrenteUri,
    setDniDorsoUri,
    setDniFrenteBase64,
    setDniDorsoBase64,
    irAlPasoSiguiente,
    irAlPasoAnterior,
  } = useFichajeDelegadoStore()
  const [errorCamara, setErrorCamara] = useState<string | null>(null)

  const sacarFoto = async (lado: 'frente' | 'dorso') => {
    setErrorCamara(null)
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync()
      if (!permiso.granted) return

      const resultado = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: false,
        base64: true,
      })
      if (!resultado.canceled) {
        const asset = resultado.assets[0]
        if (lado === 'frente') {
          setDniFrenteUri(asset.uri)
          setDniFrenteBase64(asset.base64 ?? null)
        } else {
          setDniDorsoUri(asset.uri)
          setDniDorsoBase64(asset.base64 ?? null)
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
      base64: true,
    })
    if (!resultado.canceled) {
      const asset = resultado.assets[0]
      if (lado === 'frente') {
        setDniFrenteUri(asset.uri)
        setDniFrenteBase64(asset.base64 ?? null)
      } else {
        setDniDorsoUri(asset.uri)
        setDniDorsoBase64(asset.base64 ?? null)
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
    <View testID="paso-fotos-dni-delegado" className="flex-1 bg-gray-50">
      <CabeceraDelegado titulo="Registro de nuevo delegado" onBack={handleVolver} />
      <ProgresoDelegado />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Fotos del DNI</Text>
          {nombreClub && (
            <Text className="text-gray-500 text-sm">
              Fichándose en <Text className="font-bold">{nombreClub}</Text>
            </Text>
          )}
        </View>

        <View className="gap-6">
          <View className="gap-3">
            <Text className="text-gray-700 text-sm font-medium">Frente del DNI</Text>
            <PreviewDni uri={dniFrenteUri} />
            <BotonWizard
              testID="boton-seleccionar-frente-delegado"
              texto={dniFrenteUri ? 'Cambiar' : 'Seleccionar'}
              icono="camera"
              onPress={() =>
                mostrarSelectorImagen(
                  () => sacarFoto('frente'),
                  () => elegirImagen('frente')
                )
              }
              variante="oscuro"
            />
          </View>

          <View className="gap-3">
            <Text className="text-gray-700 text-sm font-medium">Dorso del DNI</Text>
            <PreviewDni uri={dniDorsoUri} />
            <BotonWizard
              testID="boton-seleccionar-dorso-delegado"
              texto={dniDorsoUri ? 'Cambiar' : 'Seleccionar'}
              icono="camera"
              onPress={() =>
                mostrarSelectorImagen(
                  () => sacarFoto('dorso'),
                  () => elegirImagen('dorso')
                )
              }
              variante="oscuro"
            />
          </View>

          {errorCamara && <Text className="text-red-500 text-sm text-center">{errorCamara}</Text>}

          <BotonWizard
            testID="boton-subir-dni-delegado"
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
