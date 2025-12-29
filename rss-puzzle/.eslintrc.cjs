module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['**/.history', '**/.husky', '**/.vscode', '**/coverage', '**/dist', '**/node_modules'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/vite.config.*', '**/*.config.*', '**/*.test.*', '**/*.spec.*'],
      },
    ],
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'max-len': ['error', 120],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    indent: 'error',
  },
};
