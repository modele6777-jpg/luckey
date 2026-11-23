import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  timeout: 100_000,
  expect: { timeout: 30_000 },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'webkit-iphone',
      use: {
        ...devices['iPhone 16 Pro'],
        browserName: 'webkit',
      },
    },
  ],
  webServer: {
    command: 'npm run build && node dist/server.cjs',
    env: { NODE_ENV: 'production', PORT: '4173' },
    url: 'http://127.0.0.1:4173/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
