import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    svgLoader({ defaultImport: 'component' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Additional options here
      },
    },
  },
  build: {
    lib: {
      entry: './src/main.ce.ts',
      name: 'weather-widget',
      fileName: 'weather-widget',
    },
  },
  define: {
    'process.env': process.env,
  },
})
