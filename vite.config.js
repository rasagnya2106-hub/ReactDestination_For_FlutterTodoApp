import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'main.js'
      }
    }
  }
});