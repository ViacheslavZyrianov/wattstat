// eslint.config.js
import js from '@eslint/js'
import { vue } from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.js', '**/*.cjs'],
    ...js.configs.recommended,
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint,
    },
    processor: vue.processors.defineTemplateBody,
    rules: {
      ...vue.configs['vue3-recommended'].rules,
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]
