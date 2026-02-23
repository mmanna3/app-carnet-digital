import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Feather } from '@expo/vector-icons'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import BotonWizard from '../boton-wizard'

export default function PasoFoto() {
  const { fotoUri, nombreEquipo, setFotoUri, setFotoBase64, irAPaso } = useFichajeStore()

  const elegirFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    })
    if (!resultado.canceled) {
      const asset = resultado.assets[0]
      setFotoUri(asset.uri)
      setFotoBase64(asset.base64 ?? null)
    }
  }

  const handleVolver = () => {
    setFotoUri(null)
    setFotoBase64(null)
    irAPaso(2)
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={handleVolver} />
      <Progreso totalPasos={5} pasoActual={3} />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Foto del jugador</Text>
          {nombreEquipo && (
            <Text className="text-gray-500 text-sm">Fichándose en <Text className="font-bold">{nombreEquipo}</Text></Text>
          )}
        </View>

        <View className="gap-4">
          <View className="items-center">
            <View className="w-48 h-48 bg-white rounded-2xl shadow-md border-2 border-gray-200 items-center justify-center overflow-hidden">
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <Feather name="user" size={64} color="#d1d5db" />
              )}
            </View>
          </View>

          <BotonWizard
            texto={fotoUri ? 'Cambiar foto' : 'Seleccionar foto'}
            icono="camera"
            onPress={elegirFoto}
            variante="oscuro"
          />
          <BotonWizard
            texto="Subir"
            icono="upload"
            onPress={() => irAPaso(4)}
            deshabilitado={!fotoUri}
          />
        </View>
      </ScrollView>
    </View>
  )
}
