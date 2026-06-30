/**
 * Loads a subset of Playfair Display (the brand serif) as a font buffer for
 * `next/og` ImageResponse. Returns null on any failure so the caller can fall
 * back to the bundled default font instead of erroring the image route.
 */
export async function loadBrandFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&text=${encodeURIComponent(
      text,
    )}`
    const css = await (await fetch(url)).text()
    const match = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
    )
    if (!match) return null
    const res = await fetch(match[1])
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}
