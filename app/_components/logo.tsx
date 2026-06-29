import { cn } from "@/lib/utils"

/** FarKhadi wordmark (gold). Uses the brand SVG asset. */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/Logo.svg"
      alt="FarKhadi"
      width={379}
      height={133}
      className={cn("h-auto w-auto select-none", className)}
    />
  )
}
