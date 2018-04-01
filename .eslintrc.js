module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    experimentalDecorators: true,
    modules: true
  },
  'rules': {
    'quotes': [2, 'single'],
    // 'strict': [2, 'never'],
    'comma-dangle': ['error', 'never'],
    // 'semi': [2, 'never'],
    'keyword-spacing': ['error', { 'before': true }]
  }
}
