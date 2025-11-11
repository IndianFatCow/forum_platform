import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: {
    // host: '0.0.0.0',
    port: 5174,//前端端口
    proxy: {
      '/v1': {
        // target: 'https://114.55.235.23:8443/v1',//云服务器
        // target: 'https://192.168.1.166:8443/v1', //局域网
        // target: 'https://127.0.0.1:8443/v1', //本地
        target: 'http://localhost:8080', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 正在代理请求:', req.url)
          })
        },
        secure: false,
      }
    }
  }
})