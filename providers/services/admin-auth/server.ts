import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

/**
 * Minimal cookie-based admin gate. The password MUST be provided via the
 * ADMIN_PASSWORD env var — there is no fallback, so a misconfigured deploy
 * fails closed (no login) rather than open with a public default.
 * For anything beyond a single small shop, put this behind real auth.
 */
const SESSION_COOKIE = "farkhadi_admin"

function adminPassword(): string | null {
  const pwd = process.env.ADMIN_PASSWORD
  return pwd && pwd.length > 0 ? pwd : null
}

/** HMAC of the password (keyed by itself) — not reversible, unlike base64. */
function sessionToken(password: string): string {
  return createHmac("sha256", password).update("farkhadi-admin").digest("base64url")
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export async function isAdmin(): Promise<boolean> {
  const password = adminPassword()
  if (!password) return false
  const store = await cookies()
  const cookie = store.get(SESSION_COOKIE)?.value
  if (!cookie) return false
  return safeEqual(cookie, sessionToken(password))
}

export async function signIn(password: string): Promise<boolean> {
  const expected = adminPassword()
  if (!expected) {
    console.error("[admin-auth] ADMIN_PASSWORD is not set — login disabled")
    return false
  }
  if (!safeEqual(password, expected)) return false

  const store = await cookies()
  store.set(SESSION_COOKIE, sessionToken(expected), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  })
  return true
}

export async function signOut(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
