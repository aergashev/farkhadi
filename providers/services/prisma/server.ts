import "server-only"
import { PrismaClient } from "@prisma/client"

/**
 * Prisma client singleton.
 *
 * Lazily created so importing this module never touches the database at build
 * time (Next.js evaluates top-level module code during `next build`). On Vercel
 * Fluid Compute the instance is cached on `globalThis` and reused across
 * invocations, avoiding connection exhaustion. No Proxy wrapper — those break
 * libraries that introspect the client.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })
  }
  return globalForPrisma.prisma
}
