"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"
import {
  ARCHETYPES,
  QUIZ_QUESTIONS,
  QUIZ_UI,
  scoreQuiz,
  type Archetype,
  type ProductSlug,
  type QuizResult,
} from "../shared"
import { ResultCard } from "./result-card"
import { ShareCard } from "./share-card"

type Phase = "intro" | "quiz" | "loading" | "result"
type Match = { product: Product; archetype: Archetype }

export function QuizFlow({ products }: { products: Product[] }) {
  const { locale } = useI18n()
  const L = <T,>(v: Record<"uz" | "ru", T>) => pickLocale(v, locale)

  const [phase, setPhase] = useState<Phase>("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<ProductSlug[]>([])
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)

  const bySlug = (slug: ProductSlug): Match | null => {
    const product = products.find((p) => p.slug === slug)
    return product ? { product, archetype: ARCHETYPES[slug] } : null
  }

  // Loading animation: rotate lines, then reveal the result after 1.5s.
  useEffect(() => {
    if (phase !== "loading") return
    const interval = setInterval(
      () => setLoadingIdx((i) => Math.min(i + 1, QUIZ_UI.loading.length - 1)),
      375,
    )
    const timeout = setTimeout(() => {
      const priority = products.map((p) => p.slug as ProductSlug)
      setResult(scoreQuiz(answers, priority, priority))
      setPhase("result")
    }, 1500)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [phase, answers, products])

  const choose = (target: ProductSlug) => {
    const next = [...answers, target]
    setAnswers(next)
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setLoadingIdx(0)
      setPhase("loading")
    }
  }

  const restart = () => {
    setAnswers([])
    setStep(0)
    setResult(null)
    setPhase("quiz")
  }

  /* ---- Intro ---- */
  if (phase === "intro") {
    return (
      <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
        <div className="animate-in fade-in zoom-in-95 max-w-xl space-y-6 text-center duration-500">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent/40 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-primary">
            <Sparkles className="size-3.5" />
            {L(QUIZ_UI.introEyebrow)}
          </span>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
            {L(QUIZ_UI.introTitle)}
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            {L(QUIZ_UI.introSubtitle)}
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={() => setPhase("quiz")}
              className="bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90"
            >
              {L(QUIZ_UI.start)}
            </Button>
            <p className="text-xs text-muted-foreground">{L(QUIZ_UI.introNote)}</p>
          </div>
        </div>
      </div>
    )
  }

  /* ---- Questions ---- */
  if (phase === "quiz") {
    const q = QUIZ_QUESTIONS[step]
    const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100
    return (
      <div className="container-px flex min-h-[70vh] flex-col py-10">
        <div className="mx-auto w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>
                {L(QUIZ_UI.questionWord)} {step + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-accent">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div
            key={step}
            className="animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <h2 className="mb-6 text-center font-serif text-2xl sm:text-3xl">
              {L(q.title)}
            </h2>
            <div className="grid gap-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(opt.target)}
                  className={cn(
                    "group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all duration-200",
                    "hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent hover:shadow-[0_12px_32px_-18px_rgba(244,199,120,0.5)]",
                  )}
                >
                  <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                    {opt.emoji}
                  </span>
                  <span className="text-base text-brand-cream">{L(opt.label)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---- Loading ---- */
  if (phase === "loading") {
    return (
      <div className="container-px flex min-h-[70vh] flex-col items-center justify-center py-12 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-primary/15" />
          <span className="text-4xl">🧴</span>
        </div>
        <p
          key={loadingIdx}
          className="animate-in fade-in mt-8 font-serif text-xl text-brand-cream duration-300"
        >
          {L(QUIZ_UI.loading[loadingIdx])}
        </p>
      </div>
    )
  }

  /* ---- Result ---- */
  const winner = result ? bySlug(result.winner) : null
  const runnerUp = result ? bySlug(result.runnerUp) : null

  if (!winner) {
    return (
      <div className="container-px flex min-h-[60vh] items-center justify-center">
        <Button onClick={restart} className="bg-primary text-primary-foreground">
          {L(QUIZ_UI.retake)}
        </Button>
      </div>
    )
  }

  return (
    <div className="container-px animate-in fade-in py-10 duration-500 lg:py-14">
      <ResultCard match={winner} runnerUp={runnerUp} onRetake={restart} />

      <div className="mt-16">
        <h2 className="mb-6 text-center font-serif text-2xl sm:text-3xl">
          {L(QUIZ_UI.shareCtaTitle)}
        </h2>
        <ShareCard product={winner.product} archetype={winner.archetype} />
      </div>
    </div>
  )
}
