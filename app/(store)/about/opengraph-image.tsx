import { ImageResponse } from "next/og"

import { absoluteUrl } from "@/shared/lib/seo"
import { loadBrandFont } from "@/shared/seo/load-font"

export const alt = "FarKhadi — Hadicha haqida"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function AboutOgImage() {
  const photo = absoluteUrl("/founder/new1.jpg")
  const font = await loadBrandFont("Hadicha haqidaFARKHADIEAU DE PARFUM")

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
        {/* Founder portrait */}
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
          <img
            src={photo}
            alt=""
            width={470}
            height={630}
            style={{ width: 470, height: 630, objectFit: "cover" }}
          />
        </div>

        {/* Story */}
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
          <div style={{ fontSize: 74, fontWeight: 700, color: "#f4c778", lineHeight: 1.05 }}>
            Hadicha haqida
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
              fontSize: 31,
              color: "#f5efe1",
              fontFamily: "sans-serif",
              opacity: 0.9,
              maxWidth: 560,
            }}
          >
            Hashamat, nafislik va o‘ziga xoslik falsafasi
          </div>
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
