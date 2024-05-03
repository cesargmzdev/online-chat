/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {browser: true, node: true, es2021: true},
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ['node_modules', 'dist', 'public', '.eslintrc.cjs'],
  overrides: [
    {
      files: ['packages/server/**'],
      extends: [
        'eslint:recommended',
        'prettier'
      ],
    },
  ],
};