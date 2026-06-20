import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/spec/**/*Spec.ts', '**/spec/**/*Spec.tsx'],
    exclude: ['e2e/**', 'node_modules/**'],
    setupFiles: ['./src/utils/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/spec/**', 'src/utils/test-setup.ts', 'src/utils/test-utils.tsx'],
      thresholds: {
        lines: 25.41,
        branches: 18.73,
        functions: 16.85,
        statements: 24.27,
        autoUpdate: true,
      },
    },
  },
});