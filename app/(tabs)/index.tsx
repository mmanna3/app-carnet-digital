import React from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import useApiQuery from '../api/custom-hooks/use-api-query';
import { api } from '../api/api';
import { EquipoBaseDTO } from '../api/clients';

export default function EquiposScreen() {
  const { data, isLoading, isError } = useApiQuery({
    key: ['equipos'],
    fn: async () => await api.equiposDelDelegado(),
    transformarResultado: (resultado) => resultado
  });

  if (isLoading) {
    return <Text>Cargando equipos...</Text>;
  }

  if (isError) {
    return <Text>Error al cargar los equipos.</Text>;
  }

  const renderItem = ({ item }: { item: EquipoBaseDTO }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/equipo/${item.id}`)} 
      style={styles.item}
    >
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.subtitle}>Torneo: {item.torneo}</Text>
    </TouchableOpacity>
  );

  if (data)
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{data.club}</Text>
      <FlatList
        data={data.equipos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
