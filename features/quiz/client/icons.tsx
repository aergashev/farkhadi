"use client"

import { Flower2, Gift, Mars, Moon, Music, Venus, Waves, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import type { IconName } from "../shared"

type IconComponent = React.ComponentType<{
  className?: string
  strokeWidth?: number
}>

/** One consistent vocabulary of gold-stroke line icons (lucide). */
const ICONS: Record<IconName, IconComponent> = {
  flower: Flower2,
  music: Music,
  moon: Moon,
  waves: Waves,
  bolt: Zap,
  female: Venus,
  male: Mars,
  unknown: Gift,
}

/** Bare icon — always gold stroke, uniform stroke width. */
export function QuizIcon({
  name,
  className,
}: {
  name: IconName
  className?: string
}) {
  const Icon = ICONS[name]
  return <Icon className={cn("size-9", className)} strokeWidth={1.6} />
}

/** Icon in a consistent rounded container with a shared selected state. */
export function IconBadge({
  name,
  selected = false,
  size = "default",
  className,
}: {
  name: IconName
  selected?: boolean
  size?: "default" | "lg"
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl border bg-accent/40 text-primary transition-all",
        size === "lg" ? "size-20" : "size-14",
        selected ? "border-primary bg-accent" : "border-primary/25",
        className,
      )}
    >
      <QuizIcon name={name} className={size === "lg" ? "size-10" : "size-9"} />
    </span>
  )
}
