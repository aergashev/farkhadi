import { ImageResponse } from "next/og"

import { loadBrandFont } from "@/shared/seo/load-font"

export const alt = "FarKhadi — Ifor testi"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function QuizOgImage() {
  const font = await loadBrandFont("Ifor testiFARKHADIQAYSI FORSIZNIKI")

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
            "radial-gradient(circle at 50% 32%, #135029 0%, #0c2c18 72%)",
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
            marginBottom: 22,
          }}
        >
          FARKHADI · IFOR TESTI
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: "#f4c778",
            lineHeight: 1.05,
            textAlign: "center",
          }}
        >
          Qaysi ifor — siznikidir?
        </div>

        {/* Four-question motif */}
        <div style={{ display: "flex", gap: 22, marginTop: 50 }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                display: "flex",
                width: 74,
                height: 74,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(244,199,120,0.5)",
                backgroundColor: "rgba(244,199,120,0.08)",
                color: "#f4c778",
                fontSize: 34,
                fontFamily: "sans-serif",
              }}
            >
              {n}
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#f5efe1",
            fontFamily: "sans-serif",
            opacity: 0.9,
            marginTop: 40,
          }}
        >
          4 ta savol — va iforingizni topamiz
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
