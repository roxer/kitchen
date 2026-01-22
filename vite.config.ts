import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { codeServerVitePlugin } from "./code-server-vite-plugin";
import path from "path";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react(),
    tailwindcss(),
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
    codeServerVitePlugin(),
  ],
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "app/frontend/domain"),
      "@components": path.resolve(__dirname, "app/frontend/components"),
      types: path.resolve(__dirname, "app/frontend/types"),
      "@styles": path.resolve(__dirname, "app/frontend/styles"),
      "@": path.resolve(__dirname, "app/frontend"),
      "@assets": path.resolve(__dirname, "app/assets"),
    },
  },
});
