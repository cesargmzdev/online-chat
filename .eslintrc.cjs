/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  // root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-prettier/skip-formatting',
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ['node_modules', 'dist', 'public'],
};