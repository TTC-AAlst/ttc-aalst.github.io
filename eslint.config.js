import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: ['node_modules', 'public', 'dist', '.vscode'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    settings: {
      react: {version: 'detect'},
    },
    rules: {
      // TypeScript handles these
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-use-before-define': 'off',

      // Carried over from .eslintrc (formatting rules disabled - Prettier handles these)
      'implicit-arrow-linebreak': 'off',
      'no-shadow': 'warn',
      'no-multiple-empty-lines': 'off',
      'max-len': 'off',
      'dot-notation': 'warn',
      'object-curly-newline': 'off',
      'arrow-parens': 'off',
      'no-console': 'off',
      'no-debugger': 'warn',

      // React
      'react/function-component-definition': ['error', {namedComponents: 'arrow-function'}],
      'react/jsx-filename-extension': ['warn', {extensions: ['.tsx']}],
      'react/no-children-prop': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/no-array-index-key': 'off',
      'react/jsx-no-bind': 'off',
      'react/display-name': 'off',

      // Relaxed
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-plusplus': 'off',
      'no-param-reassign': 'off',
      'prefer-spread': 'off',
    },
  },
);
