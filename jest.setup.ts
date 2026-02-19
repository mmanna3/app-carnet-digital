// Silencia warnings esperados de React Native en la consola de tests
jest.spyOn(console, 'warn').mockImplementation((msg: string) => {
  if (typeof msg === 'string' && msg.includes('Warning:')) return
  console.warn(msg)
})
