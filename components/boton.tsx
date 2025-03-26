import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colores from '@/constants/Colores';

interface BotonProps {
  onPress: () => void;
  texto: string;
  deshabilitado?: boolean;
  cargando?: boolean;
  estilo?: ViewStyle;
  estiloTexto?: TextStyle;
  disabled?: boolean;
}

export default function Boton({ 
  onPress, 
  texto, 
  deshabilitado = false, 
  cargando = false,
  estilo,
  estiloTexto,
  disabled = false
}: BotonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.boton,
        (deshabilitado || disabled) && styles.botonDeshabilitado,
        cargando && styles.botonDeshabilitado,
        estilo
      ]}
      onPress={onPress}
      disabled={deshabilitado || cargando || disabled}
    >
      {cargando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.textoBoton, estiloTexto]}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: Colores.verde,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 