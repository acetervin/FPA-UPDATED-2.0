import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  publicDir: "../public",
  root: path.resolve(import.meta.dirname, "client"),
  build: {

    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
          ],
          'payment-vendor': ['@paypal/react-paypal-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'terser',
  },
  server: {
    host: process.env.NODE_ENV === 'development' ? 'localhost' : false, // Only expose localhost in development
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: true,
        xfwd: true,
        cookieDomainRewrite: 'localhost',
        headers: {
          'X-Forwarded-Proto': 'https',
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add original client IP to headers
            if (req.socket.remoteAddress) {
              proxyReq.setHeader('X-Forwarded-For', req.socket.remoteAddress);
            }
          });
        }
      },
      '/admin': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: true,
        xfwd: true,
        cookieDomainRewrite: 'localhost',
        headers: {
          'X-Forwarded-Proto': 'https',
        },
        // Validate admin routes
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            if (req.socket.remoteAddress) {
              proxyReq.setHeader('X-Forwarded-For', req.socket.remoteAddress);
            }
          });
        }
      }
    },
    fs: {
      strict: true,
      deny: [
        "**/.*",
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
        "**/.git/**",
        "**/.env*"
      ],
      allow: [
        ".."
      ]
    },

  },
});
