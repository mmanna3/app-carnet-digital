import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getTemaAgrupador } from '@/lib/design-system'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

type TarjetaTorneoGrillaProps = {
  nombre: string
  color: string | undefined
  iconName: IoniconsName
  className?: string
}

/** Card de torneo en grilla (mismo aspecto que la vista web en pantalla grande). */
export function TarjetaTorneoGrilla({
  nombre,
  color,
  iconName,
  className = '',
}: TarjetaTorneoGrillaProps) {
  const tema = getTemaAgrupador(color)

  return (
    <View
      className={`overflow-hidden rounded-2xl border ${tema.border} bg-white/5 ${className}`.trim()}
    >
      <View className="items-center px-5 py-7">
        <View
          className={`mb-4 h-[72px] w-[72px] items-center justify-center rounded-2xl border ${tema.border} ${tema.iconBg}`}
        >
          <Ionicons name={iconName} size={36} color={tema.iconColor} />
        </View>
        <Text
          style={{
            fontFamily: FUENTE_DISPLAY,
            fontSize: 16,
            color: '#f4f4f5',
            textAlign: 'center',
            lineHeight: 22,
          }}
          numberOfLines={3}
        >
          {nombre}
        </Text>
      </View>
    </View>
  )
}

type TarjetaTorneoGrillaPressableProps = TarjetaTorneoGrillaProps & {
  testID?: string
  onPress: () => void
  accessibilityLabel?: string
}

export function TarjetaTorneoGrillaPressable({
  testID,
  onPress,
  accessibilityLabel,
  className = '',
  ...grilla
}: TarjetaTorneoGrillaPressableProps) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      className={className}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? grilla.nombre}
    >
      <TarjetaTorneoGrilla {...grilla} />
    </TouchableOpacity>
  )
}
