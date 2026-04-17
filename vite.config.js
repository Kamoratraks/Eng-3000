// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // เปลี่ยนจาก react-refresh เป็น plugin-react

export default defineConfig({
  plugins: [react()],
  base: "/Eng-3000/", // <--- ต้องใส่ชื่อ Repository ของคุณตรงนี้เป๊ะๆ นะครับ!
})
