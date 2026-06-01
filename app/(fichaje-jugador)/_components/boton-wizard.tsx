import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import { TEMAS_TARJETA_ACCION } from '@/design-system/tokens/tarjeta-accion'

type IconoName = React.ComponentProps<typeof Feather>['name']

interface Props {
  texto: string
  onPress: () => void
  icono?: IconoName
  deshabilitado?: boolean
  cargando?: boolean
  testID?: string
}

export default function BotonWizard({
  texto,
  onPress,
  icono,
  deshabilitado = false,
  cargando = false,
  testID,
}: Props) {
  const tema = TEMAS_TARJETA_ACCION.verde
  const isDisabled = deshabilitado || cargando

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`w-full overflow-hidden rounded-2xl ${isDisabled ? 'opacity-70' : ''}`}
      accessibilityRole="button"
    >
      <View
        className="glass overflow-hidden rounded-2xl"
        style={{ borderWidth: 1.5, borderColor: tema.borde }}
      >
        <LinearGradient
          colors={[...tema.degradado]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View className="min-h-[48px] flex-row items-center justify-center gap-2 px-5 py-3">
          {cargando ? (
            <ActivityIndicator color="#fafafa" size="small" />
          ) : icono ? (
            <Feather name={icono} size={20} color="#fafafa" />
          ) : null}
          <Text
            className="text-sm uppercase tracking-wide text-zinc-100"
            style={{ fontFamily: FUENTE_DISPLAY }}
          >
            {texto}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
