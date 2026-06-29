# FarKhadi — Premium Perfume Marketplace

Premium parfume storefront for **FarKhadi** (founder: Hadicha). Next.js 16 (App
Router) · shadcn/ui · Prisma + Postgres · Vercel Blob · Telegram order alerts.
Bilingual **Uzbek (default) / Russian**. All perfumes are 30 ml at 350 000 UZS.

## Architecture

Feature-Sliced layered design (`shared → providers → entities → features →
processes → app`), each slice split into `client` / `server` / `shared` segments.
See `AGENTS.md` for the full convention.

- **Storefront** — home, catalog, product detail (fragrance pyramid), cart
  (korzinka) + checkout, founder story.
- **Admin** (`/admin`) — product CRUD with image upload, orders with status.
- **i18n** — cookie-based locale, dictionaries in
  `providers/lib/i18n/shared/dictionaries`.
- **Data** — Prisma + Postgres. Image uploads → Vercel Blob. New orders →
  Telegram. The catalogue self-seeds from `entities/product/data/shared/seed.ts`
  on first read of an empty database.

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres connection (Neon) |
| `DIRECT_URL` | Direct connection for `prisma db push` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (admin image uploads) |
| `TELEGRAM_BOT_TOKEN` | Bot that posts new orders |
| `TELEGRAM_CHAT_ID` | Target chat/group id |
| `ADMIN_PASSWORD` | Password for `/admin` (no default — required) |

> Without `BLOB_READ_WRITE_TOKEN`, uploads fall back to local `public/uploads`
> (dev only). On Vercel, Blob is required — the filesystem is read-only.

## Local development

```bash
npm install                 # runs `prisma generate`
# set DATABASE_URL/DIRECT_URL in .env.local (a free Neon DB works), then:
npm run db:push             # create the schema in your database
npm run dev                 # http://localhost:3000  (catalogue self-seeds)
```

Useful scripts: `npm run db:push`, `npm run db:studio`, `npm run typecheck`.

## Deploy to Vercel (Hobby plan)

1. **Push** the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new).
2. **Add a database** — in the project's *Storage* tab, connect **Neon Postgres**
   from the Marketplace. This auto-injects `DATABASE_URL` / `DIRECT_URL`.
   _(CLI: `vercel integration add neon`.)_
3. **Add Blob** — *Storage → Create → Blob*. Injects `BLOB_READ_WRITE_TOKEN`.
4. **Set env vars** — add `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_CHAT_ID` in *Settings → Environment Variables*.
5. **Create the schema** — once the DB is connected:
   ```bash
   vercel env pull .env.local   # pull DATABASE_URL locally
   npm run db:push              # push the Prisma schema to Neon
   ```
   (Or run `prisma db push` from any machine with the env vars.)
6. **Deploy.** The build runs `prisma generate && next build`. Pages are
   `force-dynamic`, so the storefront always reflects the latest products.

Everything fits the **Hobby** plan: serverless functions (Fluid Compute), Neon
free tier, and Blob free tier.
