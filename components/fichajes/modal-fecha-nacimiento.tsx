import React from 'react'
import { View, Text, TouchableOpacity, Modal, Pressable, Platform } from 'react-native'
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'

const FECHA_DEFAULT = new Date(2000, 0, 1)
const FECHA_MIN = new Date(1930, 0, 1)

interface Props {
  visible: boolean
  value: Date | null
  onClose: () => void
  onChange: (date: Date) => void
}

const pickerProps = {
  mode: 'date' as const,
  maximumDate: new Date(),
  minimumDate: FECHA_MIN,
  textColor: 'black' as const,
  locale: 'es-AR' as const,
}

export default function ModalFechaNacimiento({ visible, value, onClose, onChange }: Props) {
  const onCambioFecha = (event: DateTimePickerEvent, date?: Date) => {
    if (date) onChange(date)
    if (Platform.OS === 'android' && (event.type === 'set' || event.type === 'dismissed')) {
      onClose()
    }
  }

  if (!visible) return null

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value ?? FECHA_DEFAULT}
        display="default"
        onChange={onCambioFecha}
        {...pickerProps}
      />
    )
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
            display="spinner"
            onChange={onCambioFecha}
            {...pickerProps}
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
