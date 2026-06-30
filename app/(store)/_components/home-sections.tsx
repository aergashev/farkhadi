"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  CreditCard,
  Droplets,
  Gift,
  MessageCircle,
  Sparkles,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import {
  ARCHETYPES,
  PRODUCT_DISPLAY_NAMES,
  QUIZ_UI,
  TEASER_PREVIEWS,
} from "@/features/quiz/shared"
import { QuizIcon } from "@/features/quiz/client"

export function Hero() {
  const dict = useDict()
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 10%, rgba(244,199,120,0.16), transparent 60%), radial-gradient(50% 40% at 0% 90%, rgba(244,199,120,0.10), transparent 60%)",
        }}
      />
      <div className="container-px relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent/40 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-primary">
            <Sparkles className="size-3.5" />
            {dict.brand.eyebrow}
          </span>
          <h1 className="font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
            {dict.hero.title}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/catalog">
                {dict.hero.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 bg-transparent text-primary hover:bg-accent hover:text-primary"
            >
              <Link href="/about">{dict.hero.secondary}</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-primary/20 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <Image
              src="/founder/new3.jpg"
              alt="FarKhadi — Hadicha"
              fill
              priority
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-green-deep/80 to-transparent" />
          </div>
          <div className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-primary/30 bg-brand-green-deep/90 px-6 py-2.5 font-serif text-sm text-primary backdrop-blur sm:block">
            Eau de Parfum · 30&nbsp;ml
          </div>
        </div>
      </div>
    </section>
  )
}

export function Marquee() {
  const dict = useDict()
  const items = [...dict.marquee.items, ...dict.marquee.items]
  return (
    <div className="border-y border-border/60 bg-brand-green-deep/60 py-4">
      <div className="flex gap-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-10">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 whitespace-nowrap font-serif text-lg text-primary/80"
            >
              {item}
              <span className="text-primary/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Values() {
  const dict = useDict()
  return (
    <section className="container-px py-16 lg:py-20">
      <h2 className="mb-10 text-center font-serif text-3xl sm:text-4xl">
        {dict.values.title}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {dict.values.items.map((item, i) => (
          <Card
            key={item.title}
            className="gap-0 p-7 ring-border transition-colors hover:ring-primary/40"
          >
            <span className="font-serif text-3xl text-primary/50">
              0{i + 1}
            </span>
            <h3 className="mt-3 font-serif text-xl">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function StoryTeaser() {
  const dict = useDict()
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-brand-green-deep">
      <div className="container-px grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-24">
        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
          <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-primary/20">
            <Image
              src="/founder/IMG_5167.jpg"
              alt="Hadicha"
              fill
              sizes="14rem"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-primary/20">
            <Image
              src="/founder/IMG_5124.jpg"
              alt="Hadicha"
              fill
              sizes="14rem"
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.22em] text-primary">
            {dict.story.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl">{dict.story.title}</h2>
          <div className="space-y-3 text-muted-foreground">
            {dict.story.body.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <blockquote className="border-l-2 border-primary/50 pl-4 font-serif text-lg italic text-brand-cream">
            “{dict.story.quote}”
          </blockquote>
          <p className="font-serif text-primary">— {dict.story.signature}</p>
          <Button
            asChild
            variant="outline"
            className="gap-2 border-primary/40 bg-transparent text-primary hover:bg-accent hover:text-primary"
          >
            <Link href="/about">
              {dict.story.cta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export function QuizTeaser() {
  const { locale } = useI18n()
  const L = <T,>(v: Record<"uz" | "ru", T>) => pickLocale(v, locale)
  return (
    <section className="container-px py-10">
      <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-brand-green-deep px-6 py-12 text-center sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(244,199,120,0.16), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-xl space-y-5">
          <div className="flex justify-center gap-3 text-primary">
            {(["flower", "music", "moon", "waves", "bolt"] as const).map((n) => (
              <QuizIcon key={n} name={n} className="size-6" />
            ))}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl">{L(QUIZ_UI.teaserTitle)}</h2>
          <p className="text-muted-foreground">{L(QUIZ_UI.teaserSubtitle)}</p>
          <div className="flex flex-col items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/quiz">{L(QUIZ_UI.start)}</Link>
            </Button>
            <p className="text-xs text-muted-foreground">{L(QUIZ_UI.teaserNote)}</p>
          </div>
        </div>
      </div>

      {/* Result previews — curiosity hooks */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {TEASER_PREVIEWS.map((slug) => {
          const a = ARCHETYPES[slug]
          return (
            <Link
              key={slug}
              href="/quiz"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-accent/40 text-primary">
                <QuizIcon name={a.icon} className="size-6" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-serif text-base text-primary">
                  {L(a.name)}
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  {PRODUCT_DISPLAY_NAMES[slug]}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

const HOW_IT_WORKS = [
  {
    Icon: Truck,
    label: {
      uz: "Toshkent bo‘ylab yetkazib berish",
      ru: "Доставка по Ташкенту",
    },
  },
  {
    Icon: CreditCard,
    label: {
      uz: "Click / Payme / karta / naqd",
      ru: "Click / Payme / карта / наличные",
    },
  },
  {
    Icon: Droplets,
    label: { uz: "30 ml Eau de Parfum", ru: "30 мл Eau de Parfum" },
  },
  {
    Icon: Gift,
    label: {
      uz: "Sovg‘a uchun chiroyli qadoq",
      ru: "Красивая подарочная упаковка",
    },
  },
  {
    Icon: MessageCircle,
    label: {
      uz: "Savollar uchun Telegram / telefon",
      ru: "Telegram / телефон для вопросов",
    },
  },
]

export function HowItWorks() {
  const { locale } = useI18n()
  return (
    <section className="container-px py-16 lg:py-20">
      <h2 className="mb-10 text-center font-serif text-3xl sm:text-4xl">
        {locale === "ru" ? "Как работает заказ?" : "Buyurtma qanday ishlaydi?"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {HOW_IT_WORKS.map(({ Icon, label }, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/25 bg-accent/40 text-primary">
              <Icon className="size-7" strokeWidth={1.6} />
            </span>
            <p className="text-sm leading-relaxed text-brand-cream">
              {pickLocale(label, locale)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
