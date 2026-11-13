import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Lets the browser read MAPTILER_API from app/.env without renaming it
  envPrefix: ['VITE_', 'MAPTILER_'],
})