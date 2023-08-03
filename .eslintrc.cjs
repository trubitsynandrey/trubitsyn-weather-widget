/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  plugins: ['import', 'simple-import-sort'],
  rules: {
    'vue/multi-word-component-names': 0,
    'no-console': 2,

    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: 'if', next: '*' },
    ],

    'import/newline-after-import': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/no-import-module-exports': 'error',
    'import/no-useless-path-segments': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        endOfLine: 'auto',
      },
    ],

    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
  },
  env: {
    'vue/setup-compiler-macros': true,
  },
}
