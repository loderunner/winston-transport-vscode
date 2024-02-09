/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  env: { es2022: true },
  plugins: ['@typescript-eslint', 'import', 'n'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:n/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  rules: {
    'n/no-missing-import': 'off',
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'import/first': 'warn',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/newline-after-import': 'warn',
  },
};
