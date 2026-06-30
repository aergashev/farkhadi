import { ImageResponse } from "next/og"

import { getActiveProducts } from "@/entities/product/data/server/store"
import { absoluteUrl } from "@/shared/lib/seo"
import { loadBrandFont } from "@/shared/seo/load-font"

export const alt = "FarKhadi — Katalog"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function CatalogOgImage() {
  let bottles: string[] = []
  try {
    bottles = (await getActiveProducts()).slice(0, 4).map((p) => absoluteUrl(p.image))
  } catch {
    bottles = []
  }

  const font = await loadBrandFont("KatalogFARKHADIEAU DE PARFUM")

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c2c18",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, #135029 0%, #0c2c18 72%)",
          color: "#f5efe1",
          fontFamily: font ? "Playfair" : "serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 13,
            color: "#f4c778",
            fontFamily: "sans-serif",
            marginBottom: 18,
          }}
        >
          FARKHADI · EAU DE PARFUM
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#f4c778", lineHeight: 1 }}>
          Katalog
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#f5efe1",
            fontFamily: "sans-serif",
            opacity: 0.9,
            marginTop: 18,
          }}
        >
          Fransiyadan keltirilgan noyob iforlar
        </div>

        {bottles.length > 0 ? (
          <div style={{ display: "flex", gap: 26, marginTop: 48 }}>
            {bottles.map((src) => (
              <div
                key={src}
                style={{
                  display: "flex",
                  width: 150,
                  height: 200,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(244,199,120,0.35)",
                }}
              >
                <img
                  src={src}
                  alt=""
                  width={150}
                  height={200}
                  style={{ width: 150, height: 200, objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              width: 120,
              height: 2,
              backgroundColor: "rgba(244,199,120,0.6)",
              marginTop: 44,
            }}
          />
        )}
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
