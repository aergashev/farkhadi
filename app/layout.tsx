import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { getLocale } from "@/providers/lib/i18n/server"
import { I18nProvider } from "@/providers/lib/i18n/client"
import { CartProvider } from "@/providers/data/cart/client"

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

const serif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "FarKhadi — Premium atirlar | Премиальные ароматы",
  description:
    "FarKhadi — Fransiyadan keltirilgan noyob iforlar. Hashamat, nafislik va o‘ziga xoslik. Har bir flakon — bir hikoya.",
  icons: { icon: "/Logo.svg" },
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
