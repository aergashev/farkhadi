import type { Metadata } from "next"

// The cart is personal and transactional — keep it out of the index.
export const metadata: Metadata = {
  title: "Savatcha",
  description: "FarKhadi savatchangiz.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
