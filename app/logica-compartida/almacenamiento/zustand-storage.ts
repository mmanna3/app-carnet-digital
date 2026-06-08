import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage } from 'zustand/middleware'

/**
 * Storage para Zustand persist en React Native/Expo.
 * localStorage no existe en RN, por eso usamos AsyncStorage.
 */
export const zustandStorage = createJSONStorage(() => AsyncStorage)
