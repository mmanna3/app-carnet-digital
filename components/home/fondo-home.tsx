import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'

const IMAGEN_FONDO_HOME = require('@/assets/images/home/edefi6.png')

export function FondoHome() {
  return (
    <View style={estilos.contenedor} pointerEvents="none">
      <ImageBackground
        source={IMAGEN_FONDO_HOME}
        resizeMode="cover"
        style={estilos.imagenFondo}
        imageStyle={estilos.imagen}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={estilos.oscurecido} />
      </ImageBackground>
    </View>
  )
}

const estilos = StyleSheet.create({
  contenedor: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  imagenFondo: {
    position: 'absolute',
    top: '-3%',
    left: '-3%',
    width: '106%',
    height: '106%',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  oscurecido: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
})
