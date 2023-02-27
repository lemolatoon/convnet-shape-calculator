/// <reference types="vitest/config" />
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom"
  },
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src")
    }
  }
});