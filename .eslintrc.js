// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  ignorePatterns: ['/dist/*'],
  overrides: [
    {
      // Archivos de test: entorno Jest + permite jest.mock() antes de los imports
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
      env: { jest: true },
      rules: {
        // jest.mock() debe ir antes de los imports por el hoisting — es intencional
        'import/first': 'off',
      },
    },
    {
      // El cliente NSwag es auto-generado, no tiene sentido lintear
      files: ['app/api/clients.ts'],
      rules: { '@typescript-eslint/no-unused-vars': 'off' },
    },
  ],
}
