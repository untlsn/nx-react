/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import unocss from 'unocss/vite';
import autoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  cacheDir: './node_modules/.vite/nx-test',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: './',
    }),
    unocss(),
    autoImport({
      imports: [
        'react',
        {
          react: ['Suspense'],
          wouter: ['Route', 'Link', 'Switch', 'Redirect', 'useLocation', 'useRoute', 'useRouter'],
        },
      ],
      dts: './src/auto-import.d.ts',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: './',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: './node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
