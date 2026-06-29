"use server"

import { promises as fs } from "node:fs"
import path from "node:path"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"

import { isAdmin } from "@/providers/services/admin-auth/server"
import type { Product } from "../shared/types"
import { DEFAULT_PRICE, DEFAULT_VOLUME_ML } from "../shared/types"
import {
  deleteProductById,
  getAllProducts,
  upsertProduct,
} from "./store"

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function splitNotes(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Only raster image types we trust to serve from our own origin. */
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8 MB

class UploadError extends Error {}

async function saveUpload(file: File, slug: string): Promise<string> {
  // Derive the extension from the validated MIME type, never the filename
  // (an attacker controls file.name and could smuggle .svg/.html → stored XSS).
  const ext = ALLOWED_IMAGE_TYPES[file.type]
  if (!ext) throw new UploadError("image-type")
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("image-size")

  // Sanitise the slug so it can't influence the storage path.
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "").slice(0, 60) || "product"
  const filename = `${safeSlug}-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  // On Vercel (and anywhere with Blob configured) store to durable Blob
  // storage — the serverless filesystem is read-only/ephemeral. Locally,
  // without a token, fall back to writing into public/uploads.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`products/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
    })
    return blob.url
  }

  const dir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), buffer)
  return `/uploads/${filename}`
}

export type ProductActionResult = { ok: boolean; error?: string }

export async function upsertProductAction(
  formData: FormData,
): Promise<ProductActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" }

  const id = String(formData.get("id") ?? "").trim()
  const nameUz = String(formData.get("nameUz") ?? "").trim()
  const nameRu = String(formData.get("nameRu") ?? "").trim()

  if (!nameUz || !nameRu) return { ok: false, error: "name-required" }

  const products = await getAllProducts()
  const existing = id ? products.find((p) => p.id === id) : undefined

  const baseSlug = slugify(nameRu || nameUz) || `product-${Date.now()}`
  let slug = existing?.slug ?? baseSlug
  if (!existing) {
    let unique = baseSlug
    let n = 1
    while (products.some((p) => p.slug === unique)) unique = `${baseSlug}-${++n}`
    slug = unique
  }

  const imageFile = formData.get("image")
  let image = existing?.image ?? "/products/imagination.jpg"
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUpload(imageFile, slug)
    } catch (error) {
      const code = error instanceof UploadError ? error.message : "image-failed"
      return { ok: false, error: code }
    }
  }

  const product: Product = {
    id: existing?.id ?? slug,
    slug,
    name: { uz: nameUz, ru: nameRu },
    tagline: {
      uz: String(formData.get("taglineUz") ?? "").trim(),
      ru: String(formData.get("taglineRu") ?? "").trim(),
    },
    description: {
      uz: String(formData.get("descUz") ?? "").trim(),
      ru: String(formData.get("descRu") ?? "").trim(),
    },
    notes: {
      top: {
        uz: splitNotes(String(formData.get("topUz") ?? "")),
        ru: splitNotes(String(formData.get("topRu") ?? "")),
      },
      heart: {
        uz: splitNotes(String(formData.get("heartUz") ?? "")),
        ru: splitNotes(String(formData.get("heartRu") ?? "")),
      },
      base: {
        uz: splitNotes(String(formData.get("baseUz") ?? "")),
        ru: splitNotes(String(formData.get("baseRu") ?? "")),
      },
    },
    price: (() => {
      const raw = Number(formData.get("price"))
      return Number.isFinite(raw) && raw >= 0 ? Math.round(raw) : DEFAULT_PRICE
    })(),
    volumeMl: DEFAULT_VOLUME_ML,
    image,
    accent: String(formData.get("accent") ?? "#c9a24b").trim() || "#c9a24b",
    active: formData.get("active") === "on" || formData.get("active") === "true",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }

  await upsertProduct(product)
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function deleteProductAction(id: string): Promise<ProductActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" }
  await deleteProductById(id)
  revalidatePath("/", "layout")
  return { ok: true }
}
