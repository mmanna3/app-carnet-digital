import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Titulo } from '@/design-system/componentes'
import BarraProgresoWizard from '@/fichaje-jugador/_components/barra-progreso-wizard'
import { TOTAL_PASOS } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'

const ANCHO_LATERAL = 40

interface Props {
  paso: number
  titulo: string
  subtitulo: string
  onBack: () => void
  children: React.ReactNode
}

export default function MarcoPaso({ paso, titulo, subtitulo, onBack, children }: Props) {
  return (
    <View className="flex-1 bg-surface">
      <View className="bg-surface px-4 pb-4 pt-14">
        <View className="min-h-[40px] flex-row items-center">
          <TouchableOpacity
            testID="boton-atras"
            onPress={onBack}
            className="rounded-lg p-2"
            style={{ width: ANCHO_LATERAL }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Feather name="chevron-left" size={24} color="#e4e4e7" />
          </TouchableOpacity>
          <Text
            className="flex-1 text-center text-zinc-100"
            style={{ fontFamily: FUENTE_DISPLAY, fontSize: 17 }}
            numberOfLines={2}
          >
            Registro de árbitro
          </Text>
          <View style={{ width: ANCHO_LATERAL }} />
        </View>
      </View>
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
