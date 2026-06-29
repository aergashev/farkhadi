"use client"

import { Check, Globe } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LOCALE_LABELS,
  LOCALE_SHORT,
  LOCALES,
  useI18n,
} from "@/providers/lib/i18n/client"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, isPending } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={cn(
            "gap-1.5 text-brand-cream/80 hover:bg-accent hover:text-primary",
            className,
          )}
        >
          <Globe className="size-4" />
          <span className="text-xs font-medium tracking-wide">
            {LOCALE_SHORT[locale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className="justify-between"
          >
            {LOCALE_LABELS[l]}
            {l === locale && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
