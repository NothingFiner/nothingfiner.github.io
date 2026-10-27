import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// glaphicUI lives as a sibling repo. Alias it straight to its SOURCE, not
// its package exports: its exports point at dist/, which lags while the
// library is under active development. Vite (esbuild/rollup) transpiles
// the Lit source directly — no lib build required.
const GLAPHIC_SRC = resolve(process.cwd(), '../glaphicUI/src');

export default defineConfig({
  plugins: [preact()],
  base: './',
  resolve: {
    alias: [
      // most specific first: tokens.css lives in src/tokens/, not src/
      { find: /^@glaphic\/ui\/tokens\.css$/, replacement: resolve(GLAPHIC_SRC, 'tokens/tokens.css') },
      { find: /^@glaphic\/ui$/, replacement: resolve(GLAPHIC_SRC, 'index.ts') },
      // loose subpaths reach into src/ (e.g. '@glaphic/ui/tokens/theme.ts')
      { find: /^@glaphic\/ui\//, replacement: GLAPHIC_SRC + '/' },
    ],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 6000, // web-llm is expected to be large
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['preact', 'preact/compat', 'wouter-preact'],
          'web-llm': ['@mlc-ai/web-llm'],
        },
      },
    },
  },
});