"use client"

import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import type { FragranceNotes } from "../../../data/shared/types"

/** Presentational fragrance pyramid: top → heart → base. */
export function NotesPyramid({ notes }: { notes: FragranceNotes }) {
  const { locale } = useI18n()
  const dict = useDict()

  const rows = [
    { label: dict.product.topNotes, items: pickLocale(notes.top, locale), step: "I" },
    { label: dict.product.heartNotes, items: pickLocale(notes.heart, locale), step: "II" },
    { label: dict.product.baseNotes, items: pickLocale(notes.base, locale), step: "III" },
  ]

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">{dict.product.notesTitle}</h2>
      <ol className="space-y-3">
        {rows.map((row) =>
          row.items.length === 0 ? null : (
            <li
              key={row.label}
              className="flex gap-4 rounded-xl border border-border bg-card/60 p-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/40 font-serif text-sm text-primary">
                {row.step}
              </span>
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {row.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {row.items.map((note) => (
                    <span
                      key={note}
                      className="rounded-full bg-accent px-3 py-1 text-sm text-brand-cream"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ),
        )}
      </ol>
    </div>
  )
}
