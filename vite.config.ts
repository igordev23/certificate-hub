import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: true,
  },
  define: {
    "process.env.VITE_API_URL": process.env.VITE_API_URL
      ? JSON.stringify(process.env.VITE_API_URL)
      : "undefined",
  },
  plugins: [tanstackRouter(), tsconfigPaths(), react(), tailwindcss()],
});
