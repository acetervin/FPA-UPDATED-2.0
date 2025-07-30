/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    setupFiles: ['./server/tests/setup.ts'],
  },
});
