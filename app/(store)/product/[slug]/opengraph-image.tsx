import { ImageResponse } from "next/og"

import { getProductBySlug } from "@/entities/product/data/server/store"
import { formatPrice } from "@/shared/lib/format"
import { absoluteUrl } from "@/shared/lib/seo"
import { loadBrandFont } from "@/shared/seo/load-font"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Dynamic-route OG images need an explicit id so Next registers a stable URL
// (/product/<slug>/opengraph-image/card) and emits it in the og:image tag.
export function generateImageMetadata() {
  return [{ id: "card", alt: "FarKhadi", size, contentType }]
}

export default async function ProductOgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let product: Awaited<ReturnType<typeof getProductBySlug>> = null
  try {
    product = await getProductBySlug(slug)
  } catch {
    product = null
  }

  const name = product?.name.uz ?? "FarKhadi"
  const tagline = product?.tagline.uz ?? "Premium atirlar"
  const price = product ? `${formatPrice(product.price)} so'm` : ""
  const image = product ? absoluteUrl(product.image) : null
  const font = await loadBrandFont(name + tagline + "FARKHADI EAU DE PARFUM")

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0c2c18",
          color: "#f5efe1",
          fontFamily: font ? "Playfair" : "serif",
        }}
      >
        {/* Bottle */}
        <div
          style={{
            display: "flex",
            width: 470,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a2414",
          }}
        >
          {image ? (
            <img
              src={image}
              alt=""
              width={470}
              height={630}
              style={{ width: 470, height: 630, objectFit: "cover" }}
            />
          ) : null}
        </div>

        {/* Copy */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            backgroundImage:
              "radial-gradient(circle at 70% 30%, #135029 0%, #0c2c18 75%)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 12,
              color: "#f4c778",
              fontFamily: "sans-serif",
              marginBottom: 24,
            }}
          >
            FARKHADI · EAU DE PARFUM
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#f4c778",
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
          <div
            style={{
              width: 96,
              height: 2,
              backgroundColor: "rgba(244,199,120,0.6)",
              margin: "30px 0",
            }}
          />
          <div
            style={{
              fontSize: 32,
              color: "#f5efe1",
              fontFamily: "sans-serif",
              opacity: 0.9,
              maxWidth: 560,
            }}
          >
            {tagline}
          </div>
          {price ? (
            <div
              style={{
                fontSize: 38,
                color: "#f4c778",
                fontFamily: "sans-serif",
                marginTop: 36,
              }}
            >
              {price}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Playfair", data: font, weight: 700, style: "normal" }]
        : undefined,
    },
  )
}
