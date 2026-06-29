import { cn } from "@/lib/utils"

/** FarKhadi social presence. Single source of truth for the links. */
export const SOCIALS = {
  instagram: "https://www.instagram.com/farkhadiparfum/",
  telegram: "https://t.me/farkhadiparfum",
  handle: "@farkhadiparfum",
} as const

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42Z" />
    </svg>
  )
}

const ITEMS = [
  { key: "instagram", href: SOCIALS.instagram, label: "Instagram", Icon: InstagramIcon },
  { key: "telegram", href: SOCIALS.telegram, label: "Telegram", Icon: TelegramIcon },
] as const

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {ITEMS.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex size-10 items-center justify-center rounded-full border border-primary/30 text-brand-cream transition-colors hover:border-primary hover:bg-accent hover:text-primary"
        >
          <Icon className="size-5" />
        </a>
      ))}
    </div>
  )
}
