const expoConfig = require('eslint-config-expo/flat')
const prettierConfig = require('eslint-config-prettier')
const globals = require('globals')
const { defineConfig } = require('eslint/config')

module.exports = defineConfig([
  ...expoConfig,
  prettierConfig,
  {
    ignores: ['dist/**', 'components/EditScreenInfo.tsx', 'FIGMA-UI-PROTOTYPE.tsx'],
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      'import/first': 'off',
    },
  },
  {
    files: ['app/api/clients.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
])
