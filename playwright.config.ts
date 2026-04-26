import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    [
      'playwright-qase-reporter',
      {
        mode: process.env.QASE_MODE ?? 'testops',
        debug: false,
        testops: {
          api: {
            token: process.env.QASE_TESTOPS_API_TOKEN,
          },
          project: process.env.QASE_TESTOPS_PROJECT ?? 'SE',
          uploadAttachments: true,
          run: {
            title: `SauceDemo E2E - ${new Date().toISOString()}`,
            description: 'Test Run automatizado desde Playwright - Actividad M3 Calidad.',
            complete: true,
          },
        },
        framework: {
          playwright: {
            captureLogs: true,
          },
        },
      },
    ],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
