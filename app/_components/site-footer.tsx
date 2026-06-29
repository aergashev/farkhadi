"use client"

import Link from "next/link"
import { Phone } from "lucide-react"

import { useDict } from "@/providers/lib/i18n/client"
import { Logo } from "./logo"
import { SocialLinks, SOCIALS } from "./social-links"

export function SiteFooter() {
  const dict = useDict()

  return (
    <footer className="border-t border-border/70 bg-brand-green-deep">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo className="h-8" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {dict.footer.tagline}
          </p>
          <SocialLinks />
        </div>

        <div className="space-y-3">
          <h4 className="font-serif text-base text-primary">{dict.footer.nav}</h4>
          <ul className="space-y-2 text-sm text-brand-cream/75">
            <li>
              <Link href="/" className="transition hover:text-primary">
                {dict.nav.home}
              </Link>
            </li>
            <li>
              <Link href="/catalog" className="transition hover:text-primary">
                {dict.nav.catalog}
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-primary">
                {dict.nav.about}
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-serif text-base text-primary">
            {dict.footer.contact}
          </h4>
          <p className="text-sm text-muted-foreground">{dict.footer.orderText}</p>
          <a
            href="tel:+998949951117"
            className="inline-flex items-center gap-2 font-medium text-brand-cream transition hover:text-primary"
          >
            <Phone className="size-4 text-primary" />
            {dict.footer.phone}
          </a>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">{dict.footer.follow}</p>
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-cream transition hover:text-primary"
            >
              {SOCIALS.handle}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 FarKhadi. {dict.footer.rights}</p>
          <p>{dict.footer.madeWith} 🤍</p>
        </div>
      </div>
    </footer>
  )
}
