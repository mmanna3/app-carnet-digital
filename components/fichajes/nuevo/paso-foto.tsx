import React, { useState } from 'react'
import { View, Text, Image, ScrollView, ActionSheetIOS, Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Feather } from '@expo/vector-icons'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import BotonWizard from '../boton-wizard'
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

async function recortarCuadrado(uri: string, width: number, height: number) {
  const lado = Math.min(width, height)
  const originX = Math.floor((width - lado) / 2)
  const originY = Math.floor((height - lado) / 2)

  return ImageManipulator.manipulateAsync(
    uri,
    [{ crop: { originX, originY, width: lado, height: lado } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  )
}

export default function PasoFoto() {
  const { fotoUri, nombreEquipo, setFotoUri, setFotoBase64, irAlPasoAnterior, irAlPasoSiguiente } = useFichajeStore()
  const [errorCamara, setErrorCamara] = useState<string | null>(null)

  const procesarImagen = async (asset: ImagePicker.ImagePickerAsset) => {
    const recortada = await recortarCuadrado(asset.uri, asset.width, asset.height)
    setFotoUri(recortada.uri)
    setFotoBase64(recortada.base64 ?? null)
  }

  const elegirDeGaleria = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!resultado.canceled) await procesarImagen(resultado.assets[0])
  }

  const sacarSelfie = async () => {
    setErrorCamara(null)
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync()
      if (!permiso.granted) return

      const resultado = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      if (!resultado.canceled) await procesarImagen(resultado.assets[0])
    } catch {
      setErrorCamara('La cámara no está disponible en este dispositivo')
    }
  }

  const handleVolver = () => {
    setFotoUri(null)
    setFotoBase64(null)
    irAlPasoAnterior()
  }

  return (
    <View testID="paso-foto" className="flex-1 bg-gray-50">
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={handleVolver} />
      <Progreso />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Foto de la cara del jugador</Text>
          {nombreEquipo && (
            <Text className="text-gray-500 text-sm">
              Fichándose en <Text className="font-bold">{nombreEquipo}</Text>
            </Text>
          )}
        </View>

        <View className="gap-4">
          <View className="items-center">
            <View className="w-48 h-48 bg-white rounded-2xl shadow-md border-2 border-gray-200 items-center justify-center overflow-hidden">
              {fotoUri ? (
                <Image
                  source={{ uri: fotoUri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <Feather name="user" size={64} color="#d1d5db" />
              )}
            </View>
          </View>

          <BotonWizard
            testID="boton-seleccionar-foto"
            texto={fotoUri ? 'Cambiar foto' : 'Seleccionar foto'}
            icono="camera"
            onPress={() => mostrarSelectorImagen(sacarSelfie, elegirDeGaleria)}
            variante="oscuro"
          />
          {errorCamara && <Text className="text-red-500 text-sm text-center">{errorCamara}</Text>}
          <BotonWizard
            testID="boton-subir-foto"
            texto="Subir"
            icono="upload"
            onPress={() => irAlPasoSiguiente()}
            deshabilitado={!fotoUri}
          />
        </View>
      </ScrollView>
    </View>
  )
}
