import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: './',
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
