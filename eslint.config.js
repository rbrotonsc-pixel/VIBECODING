import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'test-results/', 'playwright-report/'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['e2e/**/*.js', '*.config.js'],
    languageOptions: { globals: globals.node },
  },
];
