import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { CarnetDigitalDTO, CarnetDigitalPendienteDTO } from '@/app/api/clients'
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '../types/estado-jugador'

interface CarnetProps {
  jugador: CarnetDigitalDTO | CarnetDigitalPendienteDTO
  mostrarEstado?: boolean
  mostrarMotivo?: boolean
}

export default function Carnet({
  jugador,
  mostrarEstado = false,
  mostrarMotivo = false,
}: CarnetProps) {
  const estado = jugador.estado as EstadoJugador
  const debeMostrarEstado =
    mostrarEstado || estado === EstadoJugador.Inhabilitado || estado === EstadoJugador.Suspendido

  const obtenerCategoria = (fechaNacimiento: Date) => {
    const año = new Date(fechaNacimiento).getFullYear().toString()
    return año.slice(-2)
  }

  return (
    <View style={styles.carnet}>
      {debeMostrarEstado && (
        <View style={[styles.carnetHeader, { backgroundColor: obtenerColorEstado(estado) }]}>
          <Text style={styles.estado}>{obtenerTextoEstado(estado)}</Text>
        </View>
      )}
      <View style={styles.carnetBody}>
        <View style={styles.headerSection}>
          <Text style={styles.equipo}>{jugador.equipo}</Text>
          <Text style={styles.torneo}>{jugador.torneo}</Text>
        </View>

        <View style={styles.photoSection}>
          {jugador.fotoCarnet && (
            <View style={styles.fotoContainer}>
              <Image source={{ uri: jugador.fotoCarnet }} style={styles.foto} resizeMode="cover" />
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DNI:</Text>
            <Text style={styles.infoValue}>{jugador.dni}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{jugador.nombre}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Apellido:</Text>
            <Text style={styles.infoValue}>{jugador.apellido}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha Nac:</Text>
            <Text style={styles.infoValue}>
              {new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoría:</Text>
            <Text style={styles.infoValue}>Cat {obtenerCategoria(jugador.fechaNacimiento)}</Text>
          </View>
        </View>

        {mostrarMotivo && 'motivo' in jugador && jugador.motivo && (
          <View style={styles.motivoContainer}>
            <Text style={styles.motivoTitulo}>Motivo:</Text>
            <Text style={styles.motivoTexto}>{jugador.motivo}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  carnet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  carnetHeader: {
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  estado: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  carnetBody: {
    padding: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
  },
  equipo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  torneo: {
    fontSize: 18,
    color: '#666',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fotoContainer: {
    width: 160,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  motivoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3f3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  motivoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#d32f2f',
  },
  motivoTexto: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
})
