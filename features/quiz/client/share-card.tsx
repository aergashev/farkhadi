"use client"

import { Camera, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"
import { QUIZ_UI, type Archetype } from "../shared"

export function ShareCard({
  product,
  archetype,
}: {
  product: Product
  archetype: Archetype
}) {
  const { locale } = useI18n()
  const L = <T,>(v: Record<"uz" | "ru", T>) => pickLocale(v, locale)
  const name = pickLocale(product.name, locale)

  // This card only ever renders client-side (reached via in-app quiz state),
  // so reading window here is safe and avoids a hydration mismatch.
  const quizUrl =
    typeof window !== "undefined" ? `${window.location.origin}/quiz` : "/quiz"
  const host = quizUrl.replace(/^https?:\/\//, "")

  const shareText = [
    `${L(QUIZ_UI.shareLabel)}…`,
    "",
    `${L(QUIZ_UI.shareMyResult)} ${L(archetype.name).toUpperCase()} ${archetype.emoji}`,
    `${L(QUIZ_UI.shareMatch)} ${name}`,
    "",
    `“${L(archetype.personality)}”`,
    "",
    `${L(QUIZ_UI.shareCtaTitle)} ${L(QUIZ_UI.shareCtaSub)}`,
  ].join("\n")

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: L(QUIZ_UI.shareTitle),
          text: shareText,
          url: quizUrl,
        })
        return
      } catch {
        // user cancelled or unsupported — fall through to copy
      }
    }
    await copyLink()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${quizUrl}`)
      toast.success(L(QUIZ_UI.linkCopied))
    } catch {
      toast.error(host)
    }
  }

  const saveStory = async () => {
    await copyLink()
    toast(L(QUIZ_UI.storyHint))
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* 9:16 story-ready card */}
      <div
        className="relative aspect-[9/16] w-full max-w-[330px] overflow-hidden rounded-[2rem] border border-primary/30 p-6 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]"
        style={{
          background:
            "linear-gradient(160deg, #0c3019 0%, #0c2c18 45%, #0a2414 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 45% at 50% 12%, rgba(244,199,120,0.20), transparent 60%)",
          }}
        />
        <div className="relative flex h-full flex-col">
          {/* Top */}
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Logo.svg" alt="FarKhadi" className="h-6 w-auto" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-primary/80">
              {L(QUIZ_UI.shareLabel)}
            </span>
          </div>

          {/* Main */}
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {L(QUIZ_UI.shareMyResult)}
            </span>
            <span className="text-6xl leading-none">{archetype.emoji}</span>
            <span className="font-serif text-2xl font-semibold uppercase tracking-wide text-primary">
              {L(archetype.name)}
            </span>
            <div className="mt-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {L(QUIZ_UI.shareMatch)}
              </p>
              <p className="font-serif text-xl text-brand-cream">{name}</p>
            </div>
            <p className="mt-2 max-w-[16rem] text-sm italic leading-relaxed text-brand-cream/90">
              “{L(archetype.personality)}”
            </p>
          </div>

          {/* Bottom */}
          <div className="flex flex-col items-center gap-1 border-t border-primary/20 pt-4">
            <span className="font-serif text-lg text-primary">
              {L(QUIZ_UI.shareCtaTitle)}
            </span>
            <span className="font-mono text-xs tracking-wide text-brand-cream/80">
              {host}
            </span>
          </div>
        </div>
      </div>

      {/* Share actions */}
      <div className="flex w-full max-w-[330px] flex-col gap-3 sm:flex-row">
        <Button
          onClick={share}
          className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Share2 className="size-4" />
          {L(QUIZ_UI.shareBtn)}
        </Button>
        <Button
          variant="outline"
          onClick={saveStory}
          className="flex-1 gap-2 border-primary/40 bg-transparent text-primary hover:bg-accent hover:text-primary"
        >
          <Camera className="size-4" />
          {L(QUIZ_UI.saveStory)}
        </Button>
      </div>
    </div>
  )
}
