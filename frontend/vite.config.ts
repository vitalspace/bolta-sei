import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      "#lib": new URL("./src/lib", import.meta.url).pathname,
      "#components": new URL("./src/components", import.meta.url).pathname,
      "#assets": new URL("./src/assets", import.meta.url).pathname,
      "#pages": new URL("./src/pages", import.meta.url).pathname,
      "#routes": new URL("./src/routes", import.meta.url).pathname,
      "#stores": new URL("./src/stores", import.meta.url).pathname,
      "#hooks": new URL("./src/hooks", import.meta.url).pathname,
      "#websockets": new URL("./src/websockets", import.meta.url).pathname,
      "#types": new URL("./src/types", import.meta.url).pathname,
      "#abi": new URL("./src/abi", import.meta.url).pathname,
    },
  },
});
