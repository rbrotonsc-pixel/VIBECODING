import { defineConfig, devices } from '@playwright/test';

const PUERTO = 8123;

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    testIdAttribute: 'data-testid',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `python3 -m http.server ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: !process.env.CI,
  },
});
