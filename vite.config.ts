import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User site (esuhail.github.io), so it is served from the domain root.
export default defineConfig({
  plugins: [react()],
  base: "/",
});
