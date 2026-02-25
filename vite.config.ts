import { defineConfig } from 'vite'


export default defineConfig({
  base: '/jamo_trucks/',
  server: {
    allowedHosts: [
      'humblingly-widowly-joni.ngrok-free.dev'
    ]
  }
})