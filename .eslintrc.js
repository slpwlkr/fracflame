module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "indent": ["error", 2, { "ignoredNodes": ["VariableDeclaration[declarations.length=0]"] }], // const 缩进bug
    // constructor bug
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
  },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly"
  }
}
