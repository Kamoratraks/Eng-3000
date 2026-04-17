import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // เปลี่ยนตรงนี้ให้เป็นชื่อ Repository ใน GitHub ของคุณ 
  // เช่น ถ้า repo ชื่อ my-flashcards ให้แก้เป็น base: '/my-flashcards/',
  base: '/ชื่อ-repo-ของคุณ/', 
})
