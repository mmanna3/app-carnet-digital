import React from 'react'
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

const FECHA_DEFAULT = new Date(2000, 0, 1)
const FECHA_MIN = new Date(1930, 0, 1)

interface Props {
  visible: boolean
  value: Date | null
  onClose: () => void
  onChange: (date: Date) => void
}

export default function ModalFechaNacimiento({ visible, value, onClose, onChange }: Props) {
  const onCambioFecha = (_: any, date?: Date) => {
    if (date) onChange(date)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl px-6 pt-4 pb-8"
        >
          <View className="items-center mb-2">
            <View className="w-12 h-1 rounded-full bg-gray-300" />
          </View>
          <DateTimePicker
            value={value ?? FECHA_DEFAULT}
            mode="date"
            display="spinner"
            onChange={onCambioFecha}
            maximumDate={new Date()}
            minimumDate={FECHA_MIN}
            textColor="black"
            locale="es-AR"
          />
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 py-3 rounded-2xl bg-liga-600 items-center"
          >
            <Text className="text-white font-semibold text-base">Listo</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
