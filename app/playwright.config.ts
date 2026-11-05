import { defineConfig, devices } from '@playwright/test';

/** Parcours web critiques sur l'export statique (`npm run e2e`). */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:8081',
    ...devices['iPhone 13'],
    browserName: 'chromium',
  },
  webServer: {
    command: 'npx expo export -p web --output-dir dist && node e2e/serve.mjs dist 8081',
    url: 'http://localhost:8081',
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
