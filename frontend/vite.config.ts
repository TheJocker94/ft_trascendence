import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


export default defineConfig({
	server: {
	  port: 8080,
	  proxy: {
		'/api': {
		  target: 'http://api:3000',
		  changeOrigin: true,
		  secure: false,      
		  ws: true,
		  rewrite: path => path.replace(/^\/api/, ''),
		},
		'/socket.io': {
		  target: 'ws://api:3000',
		  ws: true,
		  changeOrigin: true,
		}
	  }
	},
	plugins: [
	  vue(),
	  vueJsx(),
	],
	resolve: {
	  alias: {
		'@': fileURLToPath(new URL('./src', import.meta.url))
	  }
	}
})
