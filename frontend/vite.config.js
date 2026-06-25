import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/',
  plugins: [react(), tsconfigPaths()],

  // ── Vitest configuration ────────────────────────────────────────────────
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/**',
        'src/tests/**',
        'src/main.jsx',
        '**/*.config.*',
      ],
    },
    // Prevent CSS-in-JS (styled-components) from crashing tests
    css: false,
  },
});
