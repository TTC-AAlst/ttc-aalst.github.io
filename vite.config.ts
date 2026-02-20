import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/spec/**/*Spec.ts', '**/spec/**/*Spec.tsx'],
    setupFiles: ['./src/utils/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/spec/**', 'src/utils/test-setup.ts', 'src/utils/test-utils.tsx'],
      thresholds: {
        lines: 9.06,
        branches: 5.05,
        functions: 5.73,
        statements: 8.79,
        autoUpdate: true,
      },
    },
  },
});