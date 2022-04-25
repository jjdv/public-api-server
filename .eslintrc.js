module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  plugins: ['import', '@typescript-eslint', 'jest', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  rules: {
    'prettier/prettier': 'error',
    'linebreak-style': ['error', 'unix'],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['src/tests/**/*', '**/*.test.{js,ts}'] },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-param-reassign': ['error', { props: false }],
    'default-case': 'off',
  },
};
