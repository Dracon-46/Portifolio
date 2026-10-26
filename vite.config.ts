import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base: the site works at the GitHub Pages project path
  // (/gaspareportifolio.github.io/) and at any other mount point.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // The scene chunk is three.js itself; it loads lazily after first paint.
    chunkSizeWarningLimit: 1000,
  },
});
