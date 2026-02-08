import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for Enterprise Dashboard
export default defineConfig({
    plugins: [react()],
    root: './',
    build: {
        outDir: 'dist-dashboard',
        emptyOutDir: true,
    },
    server: {
        port: 5174, // Different port from main app
        open: '/src/enterprise-dashboard/index.html'
    }
})
