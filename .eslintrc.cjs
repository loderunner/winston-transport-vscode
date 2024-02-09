/**
 * @type {import('eslint').Linter.RulesRecord}
 */
const rules = {
  'n/no-missing-import': 'off',
  '@typescript-eslint/no-namespace': 'off',
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
};

const configs = [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:import/recommended',
  'plugin:n/recommended',
  'prettier',
];

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  env: { es2022: true },
  plugins: ['@typescript-eslint', 'import', 'n'],
  extends: configs,
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  overrides: [
    {
      files: ['*.test.ts'],
      plugins: ['jest'],
      env: {
        'jest/globals': true,
      },
      extends: ['plugin:jest/recommended', ...configs],
      rules: {
        ...rules,
        'n/no-unpublished-import': [
          'error',
          { allowModules: ['jest-mock-extended', 'winston'] },
        ],
      },
    },
  ],
  rules,
};
