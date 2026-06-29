"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useDict } from "@/providers/lib/i18n/client"
import { Logo } from "./logo"
import { LanguageSwitcher } from "./language-switcher"
import { CartSheet } from "./cart-sheet"

export function SiteHeader() {
  const dict = useDict()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/catalog", label: dict.nav.catalog },
    { href: "/about", label: dict.nav.about },
  ]

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-brand-green-deep/85 backdrop-blur-md">
      <div className="container-px flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" className="flex items-center" aria-label="FarKhadi">
          <Logo className="h-7 sm:h-8" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm tracking-wide transition-colors",
                isActive(link.href)
                  ? "text-primary"
                  : "text-brand-cream/75 hover:text-primary",
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1.5 left-0 h-px w-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <CartSheet />
          <Button
            variant="ghost"
            size="icon"
            className="text-brand-cream hover:bg-accent hover:text-primary md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/70 bg-brand-green-deep md:hidden">
          <div className="container-px flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "border-b border-border/40 py-3 text-sm tracking-wide last:border-0",
                  isActive(link.href) ? "text-primary" : "text-brand-cream/80",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
