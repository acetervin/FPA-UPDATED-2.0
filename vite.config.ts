import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Set the project root to the 'client' directory.
  // This tells Vite where to find the index.html and source files.
  root: 'client',
  
  plugins: [react()],
  
  resolve: {
    alias: {
      // Aliases still need to be resolved from the repository root (__dirname)
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  
  build: {
    // The output directory is resolved from the repository root.
    // This ensures the output is always in a predictable location.
    outDir: path.resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    
    // Since 'root' is 'client', rollup knows to look for 'index.html' there.
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
    },
  },
});
