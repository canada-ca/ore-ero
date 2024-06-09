import globals from 'globals';
import js from '@eslint/js';

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
    files: ['cypress/**', '**/*.mjs'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
