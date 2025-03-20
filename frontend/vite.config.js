import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Allow access from the network
    port: 5173, // Default Vite port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Proxy API requests to backend
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
