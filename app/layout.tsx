import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { getLocale } from "@/providers/lib/i18n/server"
import { I18nProvider } from "@/providers/lib/i18n/client"
import { CartProvider } from "@/providers/data/cart/client"
import { JsonLd } from "@/shared/seo/json-ld"
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  organizationLd,
  websiteLd,
} from "@/shared/lib/seo"

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

const serif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
})

const TITLE_DEFAULT = "FarKhadi — Premium atirlar | Премиальные ароматы"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: "%s — FarKhadi",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "shopping",
  icons: { icon: "/Logo.svg", apple: "/Logo.svg" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: false, address: false },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "uz_UZ",
    alternateLocale: ["ru_RU"],
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#0c2c18",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("antialiased", sans.variable, serif.variable)}
    >
      <body className="min-h-svh font-sans">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <I18nProvider locale={locale}>
          <CartProvider>{children}</CartProvider>
        </I18nProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "!bg-card !text-foreground !border-border !rounded-xl",
            },
          }}
        />
      </body>
    </html>
  )
}
