import React from 'react'
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native'
import { CarnetDigitalDTO } from '@/app/api/clients'

interface Props {
  jugador: CarnetDigitalDTO | null
  onEliminar: () => void
  onTransferir: () => void
  onCerrar: () => void
}

export default function ModalAccionesJugador({ jugador, onEliminar, onTransferir, onCerrar }: Props) {
  if (!jugador) return null

  return (
    <Modal transparent animationType="fade" visible={!!jugador} onRequestClose={onCerrar}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onCerrar}>
        <Pressable onPress={() => {}}>
          <View className="bg-white rounded-t-2xl overflow-hidden">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-base font-semibold text-center text-gray-800">
                {jugador.nombre} {jugador.apellido}
              </Text>
              <Text className="text-sm text-center text-gray-500">DNI: {jugador.dni}</Text>
            </View>

            <TouchableOpacity
              className="p-4 border-b border-gray-100"
              onPress={onEliminar}
            >
              <Text className="text-base text-center text-red-600 font-medium">
                Eliminar jugador
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 border-b border-gray-100"
              onPress={onTransferir}
            >
              <Text className="text-base text-center text-gray-800 font-medium">
                Transferir
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="p-4" onPress={onCerrar}>
              <Text className="text-base text-center text-gray-400">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
