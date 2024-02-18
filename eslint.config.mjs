import globals from 'globals';
import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress/flat'

export default [
  js.configs.recommended,
  {
    ignores: ['**/lib/', '**/_data/'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
      },
      ecmaVersion: 'latest',
      sourceType: 'script',
    },

    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.mjs'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  cypress.configs.recommended,
  {
    files: ['cypress/', 'cypress.config.js'],
    rules: {
      ...cypress.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.cypress,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
