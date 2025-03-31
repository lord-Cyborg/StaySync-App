import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'StaySync App',
          short_name: 'StaySync',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      // Bundle size analyzer (only in build mode)
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    base: env.VITE_BASE_URL || '/',
    server: {
      port: 5173,
      strictPort: true,
      historyApiFallback: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3003',
          changeOrigin: true,
          secure: false
        }
      },
      middlewares: [
        (req, res, next) => {
          if (req.url.endsWith('.html')) {
            req.url = req.url.replace(/\.html$/, '');
          }
          next();
        }
      ]
    },
    build: {
      // Generate source maps for production builds
      sourcemap: true,
      // Minification options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Output directory
      outDir: 'dist',
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', '@mui/material'],
            // Add other chunks as needed
          },
        },
      },
    },
    preview: {
      port: 5173,
    },
    // TypeScript configuration
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@mui/material'],
    },
  };
});
