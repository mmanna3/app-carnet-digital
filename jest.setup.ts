// Mock de AsyncStorage para Jest (módulo nativo no disponible en Node)
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

// Silencia warnings esperados de React Native en la consola de tests
jest.spyOn(console, 'warn').mockImplementation((msg: string) => {
  if (typeof msg === 'string' && msg.includes('Warning:')) return
  console.warn(msg)
})
