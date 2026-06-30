import type { Locale } from "@/providers/lib/i18n/shared/config"
import type { Product } from "@/entities/product/data/shared/types"
import { pickLocale } from "@/shared/lib/format"

/** Canonical production origin. Keep in sync with the Vercel custom domain. */
export const SITE_URL = "https://www.farkhadi.uz"
export const SITE_NAME = "FarKhadi"
export const SITE_DESCRIPTION =
  "FarKhadi — Fransiyadan keltirilgan noyob iforlar. Hashamat, nafislik va o‘ziga xoslik. Har bir flakon — bir hikoya."
export const SITE_PHONE = "+998949951117"
export const SOCIAL_LINKS = [
  "https://www.instagram.com/farkhadiparfum/",
  "https://t.me/farkhadiparfum",
]

/** Bilingual keyword set for the home/global metadata. */
export const SITE_KEYWORDS = [
  "FarKhadi",
  "atir",
  "parfyumeriya",
  "premium atirlar",
  "Fransiya atirlari",
  "eau de parfum",
  "духи",
  "парфюмерия",
  "премиальные ароматы",
  "нишевая парфюмерия",
  "atir Toshkent",
  "atir O‘zbekiston",
]

/** Resolve a site-relative path to an absolute URL on the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString()
}

/** schema.org Organization — the publisher of every page. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/Logo.svg"),
    image: absoluteUrl("/Logo.svg"),
    description: SITE_DESCRIPTION,
    telephone: SITE_PHONE,
    sameAs: SOCIAL_LINKS,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_PHONE,
      contactType: "sales",
      areaServed: "UZ",
      availableLanguage: ["uz", "ru"],
    },
  }
}

/** schema.org WebSite — ties pages to the brand and declares languages. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["uz", "ru"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  }
}

/** schema.org Product with an Offer (price in UZS) for a fragrance page. */
export function productLd(product: Product, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pickLocale(product.name, locale),
    description: pickLocale(product.description, locale),
    image: absoluteUrl(product.image),
    sku: product.id,
    category: "Perfume",
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: String(product.price),
      priceCurrency: "UZS",
      availability: product.active
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/product/${product.slug}`),
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  }
}

/** schema.org BreadcrumbList from an ordered list of {name, path}. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
