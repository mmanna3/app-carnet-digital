'use client';

import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '@/app/api/api';
import { CambiarPasswordDTO } from '@/app/api/clients';
import CommonStyles from '@/constants/CommonStyles';
import Colores from '@/constants/Colores';
import { useAuth } from '@/app/hooks/use-auth';

export default function CambiarPasswordScreen() {
  const params = useLocalSearchParams();
  const usuario = params.usuario as string;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuthState } = useAuth();

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const request = new CambiarPasswordDTO({
        usuario,
        passwordNuevo: newPassword
      });
      
      const response = await api.cambiarPassword(request);
      
      if (response.exito) {
        setAuthState(response.token!, usuario);
        router.push('/seleccion-de-equipo');
      } else {
        setError(response.error || 'Hubo un error al cambiar la contraseña');
      }
    } catch (err) {
      setError('Error comunicándose con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        <Text style={styles.subtitle}>
          Por favor ingrese su nueva contraseña
        </Text>
        
        <TextInput
          style={CommonStyles.input}
          placeholder="Usuario"
          placeholderTextColor="#555"
          value={usuario}
          editable={false}
        />
        
        <TextInput
          style={CommonStyles.input}
          placeholder="Nueva Contraseña"
          placeholderTextColor="#555"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!loading}
        />
        
        <TextInput
          style={CommonStyles.input}
          placeholder="Confirmar Nueva Contraseña"
          placeholderTextColor="#555"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colores.light.background,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colores.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colores.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: Colores.rojo,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colores.azul,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 