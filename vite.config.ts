import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// This configuration is designed for building from the project root.
export default defineConfig({
  plugins: [react()],
  
  // No 'root' property at the top level. This makes the config more explicit for build environments like Vercel.
  
  resolve: {
    alias: {
      // Aliases are resolved from the project root.
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  
  build: {
    // The output directory is relative to the project root.
    outDir: "dist/client",
    emptyOutDir: true,
    
    // Explicitly define the entry point for the build.
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, "client/index.html"),
      },
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
});
