import { ImageResponse } from "next/og"

import { loadBrandFont } from "@/shared/seo/load-font"

export const alt = "FarKhadi — Premium atirlar | Премиальные ароматы"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const title = "FarKhadi"
  const tagline = "Premium atirlar · Премиальные ароматы"
  const kicker = "EAU DE PARFUM"
  const font = await loadBrandFont(title + tagline + kicker)

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
            "radial-gradient(circle at 50% 38%, #135029 0%, #0c2c18 70%)",
          color: "#f5efe1",
          fontFamily: font ? "Playfair" : "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 44,
            right: 44,
            bottom: 44,
            left: 44,
            border: "1px solid rgba(244,199,120,0.45)",
            borderRadius: 18,
          }}
        />
        <div
          style={{
            fontSize: 26,
            letterSpacing: 14,
            color: "#f4c778",
            fontFamily: "sans-serif",
            marginBottom: 26,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontSize: 150,
            fontWeight: 700,
            color: "#f4c778",
            lineHeight: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: "rgba(244,199,120,0.6)",
            margin: "36px 0",
          }}
        />
        <div
          style={{
            fontSize: 36,
            color: "#f5efe1",
            fontFamily: "sans-serif",
            opacity: 0.92,
          }}
        >
          {tagline}
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
