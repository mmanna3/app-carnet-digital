import React from 'react'
import { Modal, Pressable, View, type ViewProps } from 'react-native'

type Variante = 'centro' | 'inferior'

interface Props {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  variante?: Variante
  className?: string
}

export function ModalOscuro({
  visible,
  onClose,
  children,
  variante = 'centro',
  className = '',
}: Props) {
  const esInferior = variante === 'inferior'

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable
        className={`flex-1 bg-black/50 ${esInferior ? 'justify-end' : 'justify-center items-center p-6'}`}
        onPress={onClose}
      >
        <Pressable onPress={() => {}} className={esInferior ? 'w-full' : 'w-full max-w-full'}>
          <View
            className={`bg-surface-elevated border border-border-glass overflow-hidden ${
              esInferior ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'
            } ${className}`.trim()}
          >
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export function ModalOscuroEncabezado({ children, className = '' }: ViewProps) {
  return (
    <View className={`p-4 border-b border-border-glass ${className}`.trim()}>{children}</View>
  )
}

export function ModalOscuroCuerpo({ children, className = '' }: ViewProps) {
  return <View className={`p-4 ${className}`.trim()}>{children}</View>
}

export function ModalOscuroAcciones({ children, className = '' }: ViewProps) {
  return <View className={`px-4 pb-4 pt-2 gap-3 ${className}`.trim()}>{children}</View>
}
