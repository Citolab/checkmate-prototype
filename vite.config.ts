import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // use relative paths for GitHub Pages and testing, while setting base href in index.html
  plugins: [
    react(),
    Pages({
      dirs: [{ dir: "src/artifacts", baseRoute: "" }],
      extensions: ["jsx", "tsx"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      src: path.resolve(__dirname, "./src"),
    },
  },
});
