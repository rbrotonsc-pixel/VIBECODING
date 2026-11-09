import { defineConfig } from 'vitest/config';

// Solo las pruebas de lógica junto al código; las de e2e/ son de Playwright.
export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
