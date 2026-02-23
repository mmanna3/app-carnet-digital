import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Feather } from '@expo/vector-icons'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import BotonWizard from '../boton-wizard'

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

export default function PasoFotosDni() {
  const {
    dniFrenteUri,
    dniDorsoUri,
    nombreEquipo,
    setDniFrenteUri,
    setDniDorsoUri,
    setDniFrenteBase64,
    setDniDorsoBase64,
    irAPaso,
  } = useFichajeStore()

  const elegirImagen = async (lado: 'frente' | 'dorso') => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
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
    irAPaso(3)
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={handleVolver} />
      <Progreso totalPasos={5} pasoActual={4} />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Fotos del DNI</Text>
          {nombreEquipo && (
            <Text className="text-gray-500 text-sm">Fichándose en <Text className="font-bold">{nombreEquipo}</Text></Text>
          )}
        </View>

        <View className="gap-6">
          <View className="gap-3">
            <Text className="text-gray-700 text-sm font-medium">Frente del DNI</Text>
            <PreviewDni uri={dniFrenteUri} />
            <BotonWizard
              texto={dniFrenteUri ? 'Cambiar' : 'Seleccionar'}
              icono="camera"
              onPress={() => elegirImagen('frente')}
              variante="oscuro"
            />
          </View>

          <View className="gap-3">
            <Text className="text-gray-700 text-sm font-medium">Dorso del DNI</Text>
            <PreviewDni uri={dniDorsoUri} />
            <BotonWizard
              texto={dniDorsoUri ? 'Cambiar' : 'Seleccionar'}
              icono="camera"
              onPress={() => elegirImagen('dorso')}
              variante="oscuro"
            />
          </View>

          <BotonWizard
            texto="Subir"
            icono="upload"
            onPress={() => irAPaso(5)}
            deshabilitado={!dniFrenteUri || !dniDorsoUri}
          />
        </View>
      </ScrollView>
    </View>
  )
}
