// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, "dist/public")
  },
  plugins: [vue()]
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src")
  //   }
  // }
});
