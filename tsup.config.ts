import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: false,
  clean: true,
  target: ['es2020'],
  minifyIdentifiers: false,
  minifyWhitespace: false,
  minifySyntax: false,
  treeshake: false,
  format: ['cjs', 'esm'],
  dts: true,
  tsconfig: 'tsconfig.build.json',
});
