import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 8080,
      host: '127.0.0.1',
      strictPort: false,
    },
  },
});
