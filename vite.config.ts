import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import publishedContent from './src/data/publishedContent.json';

const serializedBundle = JSON.stringify(publishedContent);
let bundleHash = 0xcbf29ce484222325n;
for (let index = 0; index < serializedBundle.length; index++) {
  bundleHash ^= BigInt(serializedBundle.charCodeAt(index));
  bundleHash = (bundleHash * 0x100000001b3n) & 0xffffffffffffffffn;
}
export const contentBundleVersion = `v14_published_${bundleHash.toString(36)}`;

export default defineConfig({
  define: {
    'import.meta.env.VITE_CONTENT_BUNDLE_VERSION': JSON.stringify(contentBundleVersion),
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3001,
    strictPort: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 4174,
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react', 'react-icons'],
          'vendor-utils': ['canvas-confetti', 'zod'],
        },
      },
    },
  },
});
