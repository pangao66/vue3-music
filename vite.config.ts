import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ vue(), vueJsx() ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8010,
    proxy: {
      '/api': {
        target: 'http://localhost:3211',
        changeOrigin: true,
        rewrite: (path)=>path.replace( '^/api', '/api')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
         @import "@/assets/scss/variable.scss";
         @import "@/assets/scss/mixin.scss";
        `
      }
    },
    devSourcemap: true
  }
})
