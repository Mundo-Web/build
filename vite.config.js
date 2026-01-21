import glob from 'glob';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: 'localhost', // Forzar IPv4 para evitar problemas con IPv6
        watch: {
            ignored: ['!**/node_modules/your-package-name/**'],
        }
    },
    plugins: [
        laravel({
            input: [
                ...glob.sync('resources/js/**/*.jsx'),
                'resources/css/app.css'
            ],
            refresh: true,
        }),
        react(),
    ],
    // resolve: name => {
    //     const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    //     return pages[`./Pages/${name}.jsx`]
    // },
    resolve: {
        alias: {
            '@Adminto': path.resolve(__dirname, 'resources/js/Components/Adminto'),
            '@Tailwind': path.resolve(__dirname, 'resources/js/Components/Tailwind'),
            '@Utils': path.resolve(__dirname, 'resources/js/Utils'),
            '@Rest': path.resolve(__dirname, 'resources/js/Actions'),
        },
    },
    build: {
        // Optimización del bundle
        target: 'es2020',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Elimina console.log en producción
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                // Code splitting mejorado
                manualChunks: (id) => {
                    // Separar vendors pesados
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'vendor-react';
                        }
                        if (id.includes('framer-motion')) {
                            return 'vendor-motion';
                        }
                        if (id.includes('lucide')) {
                            return 'vendor-icons';
                        }
                        if (id.includes('swiper')) {
                            return 'vendor-swiper';
                        }
                        if (id.includes('devextreme')) {
                            return 'vendor-devextreme';
                        }
                    }
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'app-C6GHMxSp.css')
                        return 'app.css';
                    return assetInfo.name;
                },
            },
        },
        // Aumentar límite de warnings para chunks
        chunkSizeWarningLimit: 500,
    },
    optimizeDeps: {
        include: ['sonner', 'react', 'react-dom']
    }
});
