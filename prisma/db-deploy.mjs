// Sync the database schema during the Vercel build.
//
// Runs `prisma db push` so the Product/Order tables exist after every deploy.
// Skips silently when no database URL is configured (e.g. a local `npm run
// build` without a DB), so it never breaks builds. Prefers an unpooled
// connection for the DDL when one is exposed (Neon sets *_UNPOOLED).
import { execSync } from "node:child_process"

const url =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL

if (!url) {
  console.log("[db-deploy] No database URL set — skipping `prisma db push`.")
  process.exit(0)
}

console.log("[db-deploy] Syncing schema with `prisma db push`…")
execSync("npx prisma db push --skip-generate", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: url },
})
