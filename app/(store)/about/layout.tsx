import type { Metadata } from "next"

const ABOUT_DESCRIPTION =
  "FarKhadi — Hadicha hikoyasi. Fransiyadan keltirilgan noyob iforlar, hashamat va o‘ziga xoslik falsafasi. История бренда FarKhadi."

export const metadata: Metadata = {
  title: "Hadicha haqida",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "Hadicha haqida — FarKhadi",
    description: ABOUT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Hadicha haqida — FarKhadi",
    description: ABOUT_DESCRIPTION,
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
