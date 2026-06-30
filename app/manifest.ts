import type { MetadataRoute } from "next"

import { SITE_DESCRIPTION } from "@/shared/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FarKhadi — Premium atirlar",
    short_name: "FarKhadi",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0c2c18",
    theme_color: "#0c2c18",
    lang: "uz",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/Logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  }
}
