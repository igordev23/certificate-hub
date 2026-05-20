import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    tanstackStart({
      server: { entry: "src/server.ts" },
    }),
    tsconfigPaths(),
    react(),
    tailwindcss(),
  ],
});
