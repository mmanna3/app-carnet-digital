import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CarnetDigitalDTO, CarnetDigitalPendienteDTO } from '@/app/api/clients';
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '../types/estado-jugador';

interface CarnetProps {
  jugador: CarnetDigitalDTO | CarnetDigitalPendienteDTO;
  mostrarEstado?: boolean;
  mostrarMotivo?: boolean;
}

export default function Carnet({ jugador, mostrarEstado = false, mostrarMotivo = false }: CarnetProps) {
  const estado = jugador.estado as EstadoJugador;
  const debeMostrarEstado = mostrarEstado || estado === EstadoJugador.Inhabilitado || estado === EstadoJugador.Suspendido;

  const obtenerCategoria = (fechaNacimiento: Date) => {
    const año = new Date(fechaNacimiento).getFullYear().toString();
    return año.slice(-2);
  };

  return (
    <View style={styles.carnet}>
      {debeMostrarEstado && (
        <View style={[styles.carnetHeader, { backgroundColor: obtenerColorEstado(estado) }]}>
          <Text style={styles.estado}>
            {obtenerTextoEstado(estado)}
          </Text>
        </View>
      )}
      <View style={styles.carnetBody}>
        <Text style={styles.equipo}>{jugador.equipo}</Text>
        <Text style={styles.torneo}>{jugador.torneo}</Text>
        {jugador.fotoCarnet && (
          <View style={styles.fotoContainer}>
            <Image 
              source={{ uri: jugador.fotoCarnet }} 
              style={styles.foto}
              resizeMode="cover"
            />
          </View>
        )}
        <Text style={styles.dato}>{jugador.dni}</Text>
        <Text style={styles.dato}>{jugador.nombre}</Text>
        <Text style={styles.dato}>{jugador.apellido}</Text>
        <Text style={styles.dato}>
          {new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')}
        </Text>
        <Text style={styles.categoria}>Cat {obtenerCategoria(jugador.fechaNacimiento)}</Text>
        {mostrarMotivo && 'motivo' in jugador && jugador.motivo && (
          <View style={styles.motivoContainer}>
            <Text style={styles.motivoTitulo}>Motivo:</Text>
            <Text style={styles.motivoTexto}>{jugador.motivo}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carnet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carnetHeader: {
    padding: 12,
  },
  estado: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carnetBody: {
    padding: 16,
    alignItems: 'center',
  },
  equipo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333333',
  },
  torneo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  fotoContainer: {
    marginVertical: 12,
    width: 200,
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  dato: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: 'center',
  },
  categoria: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  motivoContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
  },
  motivoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666',
  },
  motivoTexto: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 