import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/login": "http://localhost:5000",
      "/register": "http://localhost:5000",
      "/api": "http://localhost:5000",
      "/projects": "http://localhost:5000",
    },
  },
});

