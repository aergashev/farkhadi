"use client"

import { Heart, Inbox, Play, Share2, ShoppingCart, Sparkles } from "lucide-react"

import { useDict } from "@/providers/lib/i18n/client"
import {
  ARCHETYPES,
  PRODUCT_DISPLAY_NAMES,
  type QuizStats,
} from "@/features/quiz/shared"
import { QuizIcon } from "@/features/quiz/client"

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 font-serif text-3xl tabular-nums">{value}</p>
    </div>
  )
}

export function QuizStatsPanel({ stats }: { stats: QuizStats }) {
  const dict = useDict()
  const topCount = stats.byProduct[0]?.count ?? 0

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">{dict.admin.quizTitle}</h2>

      {/* Funnel */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={<Play className="size-4" />}
          label={dict.admin.quizStarted}
          value={String(stats.started)}
        />
        <StatCard
          icon={<Sparkles className="size-4" />}
          label={dict.admin.quizFinished}
          value={String(stats.finished)}
        />
        <StatCard
          icon={<Heart className="size-4" />}
          label={dict.admin.quizCompletion}
          value={`${Math.round(stats.completionRate * 100)}%`}
        />
        <StatCard
          icon={<ShoppingCart className="size-4" />}
          label={dict.admin.quizAddedToCart}
          value={String(stats.addedToCart)}
        />
        <StatCard
          icon={<Share2 className="size-4" />}
          label={dict.admin.quizShared}
          value={String(stats.shared)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gender */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-serif text-lg">{dict.admin.quizByGender}</h3>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ["female", dict.admin.quizFemale, stats.byGender.female],
                ["male", dict.admin.quizMale, stats.byGender.male],
                ["unknown", dict.admin.quizUnknown, stats.byGender.unknown],
              ] as const
            ).map(([icon, label, value]) => (
              <div
                key={icon}
                className="flex flex-col items-center rounded-xl bg-brand-green-deep/40 p-4 text-center"
              >
                <QuizIcon name={icon} className="size-7 text-primary" />
                <p className="mt-2 font-serif text-2xl tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Result distribution */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-serif text-lg">{dict.admin.quizByResult}</h3>
          {stats.byProduct.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <Inbox className="size-7" />
              <p className="text-sm">{dict.admin.quizNoData}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.byProduct.map((row) => (
                <li key={row.slug} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2">
                      <QuizIcon
                        name={ARCHETYPES[row.slug].icon}
                        className="size-4 text-primary"
                      />
                      {PRODUCT_DISPLAY_NAMES[row.slug]}
                    </span>
                    <span className="tabular-nums text-primary">{row.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-accent">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${topCount ? (row.count / topCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
