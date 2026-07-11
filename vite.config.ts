import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production build configuration (docs/ARCHITECTURE.md, docs/CI_CD.md section 8).
// The worker build target keeps simulation.worker.ts a module worker bundled locally,
// never fetched from a CDN (SEC007).
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
  worker: {
    format: 'es',
  },
  preview: {
    port: 4517,
    strictPort: true,
  },
});
