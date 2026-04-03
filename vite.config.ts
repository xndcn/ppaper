import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ppaper/' : '/',
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
