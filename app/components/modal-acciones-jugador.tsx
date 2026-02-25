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
          <View className="bg-white rounded-t-2xl overflow-hidden pb-4">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-base font-semibold text-center text-gray-800">
                {jugador.nombre} {jugador.apellido}
              </Text>
              <Text className="text-sm text-center text-gray-500">DNI: {jugador.dni}</Text>
            </View>

            <View className="px-4 pt-4 pb-4 gap-3">
              <TouchableOpacity
                className="bg-red-600 rounded-xl p-4 items-center"
                onPress={onEliminar}
              >
                <Text className="text-white font-semibold text-base">Eliminar jugador</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-liga-600 rounded-xl p-4 items-center"
                onPress={onTransferir}
              >
                <Text className="text-white font-semibold text-base">Transferir</Text>
              </TouchableOpacity>

              <TouchableOpacity className="rounded-xl p-4 items-center" onPress={onCerrar}>
                <Text className="text-base text-center text-gray-500">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
