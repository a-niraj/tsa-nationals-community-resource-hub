import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig(async ({ command, mode }) => {
  const plugins: any[] = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
  ];

  if (command === "build") {
    try {
      const { cloudflare } = await import("@cloudflare/vite-plugin");
      plugins.push(cloudflare({ viteEnvironment: { name: "ssr" } }));
    } catch {}
  }

  plugins.push(
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
  );
  plugins.push(viteReact());

  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins,
    server: {
      port: 8080,
      host: "127.0.0.1",
      strictPort: false,
    },
  };
});
