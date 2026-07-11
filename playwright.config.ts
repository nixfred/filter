import { defineConfig, devices } from '@playwright/test';

// The production smoke project runs only when explicitly requested with
// PLAYWRIGHT_SMOKE=1 (the post_deploy_smoke CI job). It targets the live
// custom domain, so it must never run in the local or ci.yml browser suite.
const smokeEnabled = process.env.PLAYWRIGHT_SMOKE === '1';

const smokeProject = smokeEnabled
  ? [
      {
        name: 'production-smoke',
        use: { ...devices['Desktop Chrome'], baseURL: 'https://filter.nixfred.com' },
        testMatch: /production_smoke\.spec\.ts/,
      },
    ]
  : [];

// Browser matrix per docs/TEST_PLAN.md section 8.2 (ruling R021, NFR008).
// Dedicated test port, server reuse disabled (GOAL.md operating law 10).
// Retries 0 so intermittent failures surface loudly (NFR010, TEST_PLAN 8.3).
export default defineConfig({
  retries: 0,
  // A full default run computes 2048 systems across ten billion years, which
  // is heavy under contention. GitHub runners have only two cores, so CI runs
  // the browser matrix serially (one worker) to give each simulation the whole
  // core and avoid cross project starvation, a test environment artifact
  // rather than a product defect. Local machines with more cores use three.
  workers: process.env.CI ? 1 : 3,
  timeout: 90_000,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
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
      // WebKit iOS emulation is far slower than real hardware and cannot
      // complete a full 2048 system simulation within a CI budget on a two
      // core runner. It therefore runs the light iOS Safari interaction and
      // layout specs (opening, dialogs, keyboard, toggles). The WebKit engine
      // behavior for full runs is covered by the webkit desktop project, and
      // the heavy mobile layout run is covered by the faster mobile-chrome
      // Chromium emulation. This is a test environment scoping, not a support
      // gap: iOS Safari 16 and later remains a supported target (NFR008, R021).
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'], baseURL: 'http://localhost:4517' },
      testMatch: /(onboarding|accessibility_ui)\.spec\.ts/,
    },
    {
      // Mobile Chromium emulation runs the layout and interaction specs. The
      // full simulation completion specs run on the desktop projects, where
      // the same engine behavior is verified without the mobile emulation
      // compute penalty on a constrained CI runner.
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], baseURL: 'http://localhost:4517' },
      testMatch: /(onboarding|accessibility_ui|mobile)\.spec\.ts/,
    },
    ...smokeProject,
  ],
  // The local preview server is only needed for the local browser matrix, not
  // the production smoke run against the live domain.
  webServer: smokeEnabled
    ? undefined
    : {
        command: 'npm run preview',
        port: 4517,
        reuseExistingServer: false,
      },
});
