import { fileURLToPath } from 'node:url';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig((_configEnv) =>
  defineConfig({
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      include: [
        'src/**/*.spec.js',
        'src/**/*.spec.ts',
        'src/**/*.test.js',
        'src/**/*.test.ts',
      ],
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
    },
  }),
);
