module.exports = {
  root: true,
  // https://github.com/payloadcms/eslint-config/blob/main/src/index.js removed as they fall behind on versions ('@payloadcms')
  parser: "@typescript-eslint/parser",
  extends: ['plugin:@next/next/recommended'],
  rules: {
    'no-console': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: {
    NodeJS: true,
  },
}
