"use client"

import Image from "next/image"
import { Sparkles } from "lucide-react"

import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import type { FragranceNotes } from "../../../data/shared/types"
import { noteImage } from "./note-images"

/** A single ingredient: round photo thumbnail + label, reference-grid style. */
function NoteThumb({ note }: { note: string }) {
  const src = noteImage(note)
  return (
    <figure className="flex flex-col items-center gap-2 text-center">
      <div className="relative size-16 overflow-hidden rounded-full border border-primary/20 bg-brand-cream shadow-sm sm:size-[4.5rem]">
        {src ? (
          <Image
            src={src}
            alt={note}
            fill
            sizes="72px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center bg-accent/40 text-primary">
            <Sparkles className="size-6" strokeWidth={1.6} />
          </span>
        )}
      </div>
      <figcaption className="max-w-[7rem] text-xs leading-tight text-foreground/80 sm:text-sm">
        {note}
      </figcaption>
    </figure>
  )
}

/** Presentational fragrance pyramid: top → heart → base, with ingredient photos. */
export function NotesPyramid({ notes }: { notes: FragranceNotes }) {
  const { locale } = useI18n()
  const dict = useDict()

  const rows = [
    { label: dict.product.topNotes, items: pickLocale(notes.top, locale), step: "I" },
    { label: dict.product.heartNotes, items: pickLocale(notes.heart, locale), step: "II" },
    { label: dict.product.baseNotes, items: pickLocale(notes.base, locale), step: "III" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">{dict.product.notesTitle}</h2>
      <ol className="space-y-8">
        {rows.map((row) =>
          row.items.length === 0 ? null : (
            <li
              key={row.label}
              className="rounded-xl border border-border bg-card/60 p-5"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/40 font-serif text-sm text-primary">
                  {row.step}
                </span>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {row.label}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 md:grid-cols-5">
                {row.items.map((note) => (
                  <NoteThumb key={note} note={note} />
                ))}
              </div>
            </li>
          ),
        )}
      </ol>
    </div>
  )
}
