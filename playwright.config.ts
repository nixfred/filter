import { defineConfig, devices } from '@playwright/test';

// Browser matrix per docs/TEST_PLAN.md section 8.2 (ruling R021, NFR008).
// Dedicated test port, server reuse disabled (GOAL.md operating law 10).
// Retries 0 so intermittent failures surface loudly (NFR010, TEST_PLAN 8.3).
export default defineConfig({
  retries: 0,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview',
    port: 4517,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4517' },
      testIgnore: /production_smoke\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:4517' },
      testIgnore: /production_smoke\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], baseURL: 'http://localhost:4517' },
      testIgnore: /production_smoke\.spec\.ts/,
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'], baseURL: 'http://localhost:4517' },
      testIgnore: /production_smoke\.spec\.ts/,
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], baseURL: 'http://localhost:4517' },
      testIgnore: /production_smoke\.spec\.ts/,
    },
    {
      // Runs only the post deploy smoke spec against production (docs/TEST_PLAN.md 8.2).
      // No matching spec exists before G6, so this project is inert until then.
      name: 'production-smoke',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://filter.nixfred.com' },
      testMatch: /production_smoke\.spec\.ts/,
    },
  ],
});
