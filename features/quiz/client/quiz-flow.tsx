"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"
import {
  ARCHETYPES,
  GENDER_QUESTION,
  QUIZ_QUESTIONS,
  QUIZ_UI,
  scoreQuiz,
  type Archetype,
  type Gender,
  type ProductSlug,
  type QuizQuestion,
  type QuizResult,
  type Weights,
} from "../shared"
import { recordQuizEvent } from "../server/actions"
import { ResultCard } from "./result-card"
import { ShareCard } from "./share-card"

type Phase = "intro" | "gender" | "quiz" | "loading" | "result"
type Match = { product: Product; archetype: Archetype }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuizFlow({ products }: { products: Product[] }) {
  const { locale } = useI18n()
  const L = <T,>(v: Record<"uz" | "ru", T>) => pickLocale(v, locale)

  const [phase, setPhase] = useState<Phase>("intro")
  const [gender, setGender] = useState<Gender | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Weights[]>([])
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  // Shuffle each question's options once so placement is never predictable.
  const [questions] = useState<QuizQuestion[]>(() =>
    QUIZ_QUESTIONS.map((q) => ({ ...q, options: shuffle(q.options) })),
  )
  const [genderOptions] = useState(() => shuffle(GENDER_QUESTION.options))

  const bySlug = (slug: ProductSlug): Match | null => {
    const product = products.find((p) => p.slug === slug)
    return product ? { product, archetype: ARCHETYPES[slug] } : null
  }

  // Loading animation → compute result after 1.5s.
  useEffect(() => {
    if (phase !== "loading" || !gender) return
    const interval = setInterval(
      () => setLoadingIdx((i) => Math.min(i + 1, QUIZ_UI.loading.length - 1)),
      375,
    )
    const timeout = setTimeout(() => {
      const slugs = products.map((p) => p.slug as ProductSlug)
      const res = scoreQuiz(answers, gender, slugs, slugs)
      setResult(res)
      setPhase("result")
      void recordQuizEvent({
        type: "finished",
        gender,
        productSlug: res.winner,
      })
    }, 1500)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [phase, gender, answers, products])

  const chooseGender = (g: Gender) => {
    setGender(g)
    setPhase("quiz")
    void recordQuizEvent({ type: "started", gender: g })
  }

  const choose = (weights: Weights) => {
    const next = [...answers, weights]
    setAnswers(next)
    if (step < questions.length - 1) {
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
    setGender(null)
    setPhase("gender")
  }

  /* ---- Intro ---- */
  if (phase === "intro") {
    return (
      <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
        <div className="animate-in fade-in zoom-in-95 max-w-xl space-y-6 text-center duration-500">
          <p className="text-3xl tracking-[0.3em]">🌸 🎼 🌙 🌊 ⚡</p>
          <span className="inline-block rounded-full border border-primary/30 bg-accent/40 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-primary">
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
              onClick={() => setPhase("gender")}
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

  /* ---- Gender ---- */
  if (phase === "gender") {
    return (
      <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
        <div className="animate-in fade-in slide-in-from-bottom-3 w-full max-w-md space-y-8 text-center duration-300">
          <h2 className="font-serif text-3xl sm:text-4xl">
            {L(QUIZ_UI.genderTitle)}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => chooseGender(opt.value)}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent hover:shadow-[0_12px_32px_-18px_rgba(244,199,120,0.5)]"
              >
                <span className="text-5xl transition-transform duration-200 group-hover:scale-110">
                  {opt.emoji}
                </span>
                <span className="font-serif text-lg text-brand-cream">
                  {L(opt.label)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ---- Questions ---- */
  if (phase === "quiz") {
    const q = questions[step]
    const progress = ((step + 1) / questions.length) * 100
    return (
      <div className="container-px flex min-h-[70vh] flex-col py-10">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>
                {L(QUIZ_UI.questionWord)} {step + 1} / {questions.length}
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
                  onClick={() => choose(opt.weights)}
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
        <div className="relative size-20">
          <span className="absolute inset-0 rounded-full border-2 border-primary/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary [animation-duration:0.9s]" />
          <span className="absolute inset-[30%] animate-pulse rounded-full bg-primary/25 blur-[2px]" />
          <span
            className="absolute inset-0 animate-spin rounded-full border border-transparent border-b-primary/40 [animation-direction:reverse] [animation-duration:1.4s]"
          />
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
  const runnerUp =
    result && result.runnerUp !== result.winner ? bySlug(result.runnerUp) : null

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
      <ResultCard
        match={winner}
        runnerUp={runnerUp}
        onRetake={restart}
        onAddToCart={() =>
          void recordQuizEvent({
            type: "added_to_cart",
            gender: gender ?? undefined,
            productSlug: winner.product.slug,
          })
        }
      />

      <div className="mt-16">
        <h2 className="mb-6 text-center font-serif text-2xl sm:text-3xl">
          {L(QUIZ_UI.shareHeading)}
        </h2>
        <ShareCard
          product={winner.product}
          archetype={winner.archetype}
          onShared={() =>
            void recordQuizEvent({
              type: "shared",
              gender: gender ?? undefined,
              productSlug: winner.product.slug,
            })
          }
        />
      </div>
    </div>
  )
}
