import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Docker: VITE_API_TARGET=http://gateway:80
  // Local: VITE_API_TARGET=http://localhost:8080
  const apiTarget = env.VITE_API_TARGET || "http://gateway:80";

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "frontend",
        "host.docker.internal",
      ],
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, options) => {
            console.log("📡 Proxy target:", options.target);
            proxy.on("proxyReq", (_proxyReq, req) => {
              console.log("[Request]", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req) => {
              console.log("[Response]", proxyRes.statusCode, req.url);
            });
            proxy.on("error", (err) => {
              console.error("**FAIL**", err.message);
            });
          },
        },
      },
    },
  };
});
