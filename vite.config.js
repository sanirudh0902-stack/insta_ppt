import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import { copyFileSync } from 'fs';

const root = resolve(__dirname, 'insta_ppt');

export default defineConfig({
  root,
  publicDir: resolve(root, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssMinify: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    open: true,
  },
  plugins: [
    {
      name: 'copy-legacy-scripts',
      closeBundle() {
        const rootDir = resolve(__dirname, 'insta_ppt');
        const outDir = resolve(__dirname, 'dist');
        const src = join(rootDir, 'certificate.js');
        const dest = join(outDir, 'certificate.js');
        copyFileSync(src, dest);
      },
    },
  ],
});
