import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'http://157.10.161.207:5001',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});