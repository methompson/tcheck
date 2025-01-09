import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  ...tseslint.config(tseslint.configs.recommended),
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', 'jest.config.*', 'tsconfig.json'],
  },
  {
    languageOptions: {
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // Typescript
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Regular
      'prettier/prettier': 'warn',
      semi: 'error',
      quotes: ['warn', 'single', { avoidEscape: true }],
      indent: 'off',
      'no-console': 'warn',
      'no-multi-spaces': [
        'error',
        {
          ignoreEOLComments: false,
        },
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],
      'no-trailing-spaces': 'error',

      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'always'],
      'max-len': [
        'warn',
        {
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          code: 100,
          comments: 100,
        },
      ],
      'no-restricted-syntax': 'off',
    },
  },
];
