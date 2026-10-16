import { defineConfig, devices } from '@playwright/test';

const isCi = !!process.env['CI'];
const baseURL = isCi ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:4200';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: isCi ? 'npm run preview' : 'npm start -- --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !isCi,
    timeout: 120000,
  },
});
