import { SiteHeader } from "@/app/_components/site-header"
import { SiteFooter } from "@/app/_components/site-footer"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
