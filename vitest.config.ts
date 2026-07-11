import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Unit, integration, determinism, and property test configuration (docs/TEST_PLAN.md sections 4, 5).
// Coverage floors per NFR009: simulation domain 85 percent lines and functions,
// whole project 80 percent lines. The exclude list removes type only files and
// bootstrap lines so the floor reflects real logic, per docs/TEST_PLAN.md section 4.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // globals exposes afterEach, which Testing Library needs for automatic
    // render cleanup between tests.
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: [
        // Entry points and type only files (docs/TEST_PLAN.md section 4).
        'src/main.tsx',
        'src/vite_env.d.ts',
        'src/simulation/types.ts',
        'src/**/*.worker.ts',
        // Browser only code: WebGL rendering and the requestAnimationFrame
        // driven viewport need a real GPU and canvas, so they are verified by
        // the Playwright e2e suite in real browsers, not by jsdom unit tests
        // (docs/TEST_PLAN.md section 4 rationale, extended to the render path).
        'src/renderer/galaxy_layer.ts',
        'src/renderer/renderer.ts',
        'src/components/GalaxyViewport/GalaxyViewport.tsx',
        // React composition shells whose behavior is asserted end to end.
        'src/app/providers.tsx',
        'src/app/ErrorBoundary.tsx',
      ],
      thresholds: {
        lines: 80,
        'src/simulation/**': {
          lines: 85,
          functions: 85,
        },
      },
    },
  },
});
