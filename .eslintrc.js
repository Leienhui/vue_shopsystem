module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'space-before-function-paren': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-dangle': ["error", {
      "arrays": "never",
      "objects": "never",
      "imports": "never",
      "exports": "never",
      "functions": "never"
    }],
    "key-spacing": 0
  }
}
