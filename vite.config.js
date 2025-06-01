import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MyEskul",
        short_name: "MyEskul",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/smp.ico",
            sizes: "192x192",
            type: "image/x-icon",
          },
          {
            src: "/smp.ico",
            sizes: "512x512",
            type: "image/x-icon",
          },
        ],
      },
    }),
  ],
});
