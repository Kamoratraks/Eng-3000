// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh'

export default defineConfig({
  plugins: [react()],
  base: "/Eng-3000/", // <--- ต้องใส่ชื่อ Repository ของคุณตรงนี้เป๊ะๆ นะครับ!
})
