import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/app/hooks/use-auth';
import useApiQuery from '../api/custom-hooks/use-api-query';
import { api } from '../api/api';

export default function TabOneScreen() {
  const { usuario } = useAuth();

  const { data, isLoading, isError } = useApiQuery({
    key: ['equipos'],
    fn: async () =>
      await api.equiposDelDelegado(),
    transformarResultado: (resultado) => {console.log(resultado)}
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.userText}>Usuario: {usuario || 'No hay usuario'}</Text>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userText: {
    fontSize: 16,
    marginTop: 20,
  },
});
