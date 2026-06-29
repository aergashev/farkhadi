import { z } from "zod"

/**
 * Isomorphic checkout validation. Shared by the client form (instant feedback)
 * and the server action (defense in depth — never trust the client).
 *
 * Uzbek phone numbers: country code 998 + 9 national digits (12 total), or a
 * bare 9-digit national number. Formatting (spaces, dashes, parentheses, a
 * leading +) is ignored — only the digits are validated.
 */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "")
  if (digits.startsWith("998")) return `+${digits}`
  if (digits.length === 9) return `+998${digits}`
  return `+${digits}`
}

export function isValidUzPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "")
  return /^998\d{9}$/.test(digits) || /^\d{9}$/.test(digits)
}

/** The fixed prefix every Uzbek phone field starts with. */
export const UZ_PHONE_PREFIX = "+998 "

/**
 * Progressively formats user input as `+998 90 900 90 90`.
 * The `+998` country code is always kept; only the 9 national digits are
 * grouped as 2-3-2-2. Safe to run on every keystroke.
 */
export function formatUzPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("998")) digits = digits.slice(3)
  digits = digits.slice(0, 9)

  const groups: string[] = []
  if (digits.length > 0) groups.push(digits.slice(0, 2))
  if (digits.length > 2) groups.push(digits.slice(2, 5))
  if (digits.length > 5) groups.push(digits.slice(5, 7))
  if (digits.length > 7) groups.push(digits.slice(7, 9))

  return groups.length ? `+998 ${groups.join(" ")}` : "+998"
}

export const phoneSchema = z
  .string()
  .trim()
  .refine(isValidUzPhone, { message: "phone" })
  .transform(normalizePhone)

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, { message: "name" }).max(80),
  phone: phoneSchema,
  address: z.string().trim().min(3, { message: "address" }).max(200),
  comment: z.string().trim().max(500).optional().or(z.literal("")),
})

export type CheckoutInput = z.input<typeof checkoutSchema>
export type CheckoutData = z.output<typeof checkoutSchema>

/** First validation error code ("name" | "phone" | "address"), if any. */
export function firstCheckoutError(input: CheckoutInput): string | null {
  const result = checkoutSchema.safeParse(input)
  if (result.success) return null
  return result.error.issues[0]?.message ?? "phone"
}
