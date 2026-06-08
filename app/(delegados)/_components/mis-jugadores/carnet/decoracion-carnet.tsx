import React from 'react'
import { View, Text, Image } from 'react-native'
import { FUENTE_DISPLAY, FUENTE_SANS_SEMIBOLD } from '@/lib/design-system/fuentes'
import { hexConOpacidad } from '@/lib/utilidades/color-carnet'
import { COLORES_ESTADO, LOGOS_LIGAS } from './carnet-estilos'

export function DecoracionCarnet({ colorLiga }: { colorLiga: string }) {
  return (
    <View pointerEvents="none" className="absolute inset-0 z-0 overflow-hidden">
      <View
        style={{
          position: 'absolute',
          top: -48,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: hexConOpacidad(colorLiga, 0.12),
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -72,
          left: -56,
          width: 200,
          height: 140,
          backgroundColor: hexConOpacidad(colorLiga, 0.08),
          transform: [{ rotate: '24deg' }],
          borderRadius: 12,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 8,
          left: -28,
          width: 72,
          height: 72,
          backgroundColor: hexConOpacidad(colorLiga, 0.06),
          transform: [{ rotate: '45deg' }],
          borderRadius: 4,
        }}
      />
    </View>
  )
}

export function PlaceholderFoto({ iniciales }: { iniciales: string }) {
  return (
    <View className="h-48 w-48 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-200">
      <Text
        className="text-3xl text-zinc-500"
        style={{ fontFamily: FUENTE_SANS_SEMIBOLD }}
        accessibilityLabel="Sin foto"
      >
        {iniciales}
      </Text>
    </View>
  )
}

export function MarcaAguaLiga({ leagueId }: { leagueId: string | undefined }) {
  const logo = leagueId ? LOGOS_LIGAS[leagueId] : undefined
  if (!logo) return null

  return (
    <View pointerEvents="none" className="absolute right-2 bottom-16 z-0 items-end justify-end">
      <Image
        source={logo}
        accessible={false}
        style={{ width: 200, height: 200, opacity: 0.09 }}
        resizeMode="contain"
      />
    </View>
  )
}

/** Cinta oblicua tipo clausura sobre todo el carnet. */
export function FranjaClausuraSuspendido() {
  const repeticiones = ['SUSPENDIDO', 'SUSPENDIDO', 'SUSPENDIDO'] as const

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 z-30 overflow-hidden"
      accessibilityLabel="Jugador suspendido"
    >
      <View className="absolute inset-0 bg-black/12" />
      <View
        className="absolute flex-row items-center justify-center gap-8"
        style={{
          top: '36%',
          left: '-28%',
          width: '156%',
          height: 72,
          transform: [{ rotate: '-34deg' }],
          backgroundColor: COLORES_ESTADO.ROJO_CLAUSURA,
          borderTopWidth: 4,
          borderBottomWidth: 4,
          borderColor: COLORES_ESTADO.ROJO_CLAUSURA_BORDE,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        {repeticiones.map((texto, i) => (
          <Text
            key={i}
            className="text-white"
            style={{
              fontFamily: FUENTE_DISPLAY,
              fontSize: 26,
              lineHeight: 30,
              letterSpacing: 3,
            }}
          >
            {texto}
          </Text>
        ))}
      </View>
    </View>
  )
}
