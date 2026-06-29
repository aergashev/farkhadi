"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useDict } from "@/providers/lib/i18n/client"
import { SocialLinks } from "@/app/_components/social-links"

const GALLERY = [
  "/founder/IMG_5117.jpg",
  "/founder/IMG_5124.jpg",
  "/founder/IMG_5167.jpg",
  "/founder/IMG_5173.jpg",
]

export default function AboutPage() {
  const dict = useDict()

  return (
    <div>
      {/* Intro */}
      <section className="container-px grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.22em] text-primary">
            {dict.about.eyebrow}
          </span>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
            {dict.about.title}
          </h1>
          <p className="text-lg text-brand-cream">{dict.about.intro}</p>
          <div className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">{dict.about.p1}</p>
            <p className="leading-relaxed">{dict.about.p2}</p>
            <p className="leading-relaxed">{dict.about.p3}</p>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-primary/20 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
          <Image
            src="/founder/IMG_5173.jpg"
            alt="Hadicha"
            fill
            priority
            sizes="(min-width: 1024px) 28rem, 90vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Quote band */}
      <section className="border-y border-border/60 bg-brand-green-deep py-14">
        <div className="container-px max-w-3xl text-center">
          <blockquote className="font-serif text-2xl italic leading-relaxed text-brand-cream sm:text-3xl">
            “{dict.story.quote}”
          </blockquote>
          <p className="mt-5 font-serif text-primary">— {dict.story.signature}</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-px py-14 lg:py-20">
        <h2 className="mb-8 font-serif text-3xl">{dict.about.galleryTitle}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {GALLERY.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-primary/15"
            >
              <Image
                src={src}
                alt={`Hadicha ${i + 1}`}
                fill
                sizes="(min-width: 640px) 22vw, 45vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-px pb-20">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-primary/25 bg-card px-6 py-12 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">{dict.about.cta}</h2>
          <a
            href="tel:+998949951117"
            className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-primary"
          >
            <Phone className="size-4 text-primary" />
            {dict.footer.phone}
          </a>
          <SocialLinks className="justify-center" />
          <Button
            asChild
            size="lg"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/catalog">
              {dict.featured.viewAll}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
