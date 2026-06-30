import type { MetadataRoute } from "next"

import { SITE_URL } from "@/shared/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin dashboard and the personal cart should never be indexed.
        disallow: ["/admin", "/cart"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
