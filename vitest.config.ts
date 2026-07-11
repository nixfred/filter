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
        'src/main.tsx',
        'src/vite_env.d.ts',
        'src/simulation/types.ts',
        'src/**/*.worker.ts',
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
