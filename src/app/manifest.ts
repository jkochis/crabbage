import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nineteen Game",
    description: "See how fast you can score a deal",
    theme_color: "#000000",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/nineteen-game/out",
    icons: [
      {
        src: "/nineteen-game/out/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/nineteen-game/out/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
