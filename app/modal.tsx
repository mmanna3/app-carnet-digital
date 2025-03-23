import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useApiQuery from './api/custom-hooks/use-api-query';
import { api } from './api/api';
import { EquipoBaseDTO } from './api/clients';
import { useTeam } from './hooks/use-team';

export default function TeamSelectionModal() {
  const { data, isLoading, isError } = useApiQuery({
    key: ['equipos'],
    fn: async () => await api.equiposDelDelegado(),
    transformarResultado: (resultado) => resultado
  });

  const { setSelectedTeam } = useTeam();

  const handleTeamSelect = (team: EquipoBaseDTO) => {
    if (team.id) {
      setSelectedTeam(team.id);
      router.replace('/mis-jugadores');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando equipos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error al cargar los equipos</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: EquipoBaseDTO }) => (
    <TouchableOpacity 
      onPress={() => handleTeamSelect(item)} 
      style={styles.item}
    >
      <Text style={styles.itemTitle}>{item.nombre}</Text>
      <Text style={styles.itemSubtitle}>Torneo: {item.torneo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu equipo</Text>
      <Text style={styles.subtitle}>Debes seleccionar un equipo para continuar</Text>
      {data && (
        <FlatList
          data={data.equipos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id!.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
