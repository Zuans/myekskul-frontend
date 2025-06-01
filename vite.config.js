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
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/smp.jpg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "/smp.jpg",
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      },
    }),
  ],
});
