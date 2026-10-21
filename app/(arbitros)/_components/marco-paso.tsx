import React from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { CabeceraPaso, Titulo } from '@/design-system/componentes'
import BarraProgresoWizard from '@/fichaje-jugador/_components/barra-progreso-wizard'
import { TOTAL_PASOS } from '@/logica-compartida/hooks/use-registro-arbitro-store'

interface Props {
  paso: number
  titulo: string
  subtitulo: string
  onBack: () => void
  testID: string
  children: React.ReactNode
}

export default function MarcoPaso({ paso, titulo, subtitulo, onBack, testID, children }: Props) {
  return (
    <View testID={testID} className="flex-1 bg-surface">
      <CabeceraPaso testID="titulo-cabecera" titulo="Registro de árbitro" onBack={onBack} />
      <BarraProgresoWizard pasoActual={paso} totalPasos={TOTAL_PASOS} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6 pb-12">
            <View className="mb-6">
              <Titulo>{titulo}</Titulo>
              <Text className="text-sm text-zinc-400">{subtitulo}</Text>
            </View>
            <View className="gap-3">{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
