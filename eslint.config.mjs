import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  ...tseslint.config(tseslint.configs.recommended),
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', '.eslintrc.js', 'jest.config.*', 'tsconfig.json'],
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
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-function': ['off'],

      // Regular
      'prettier/prettier': 'warn',
      indent: 'off',
      'no-unused-vars': 'off',
      'no-empty-function': 'off',
      'max-classes-per-file': 'off',
      strict: 'warn',
      camelcase: 'warn',
      'no-console': 'warn',
      'no-underscore-dangle': 'off',
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
      'brace-style': ['error', '1tbs'],
      semi: 'error',

      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'always'],
      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],
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
      quotes: ['warn', 'single', { avoidEscape: true }],
      'import/no-named-as-default-member': 'off',

      'import/namespace': 'off',
      'import/named': 'off',
    },
  },
];
