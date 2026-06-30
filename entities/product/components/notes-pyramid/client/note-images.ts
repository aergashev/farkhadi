/**
 * Maps a free-text fragrance note (in any locale) to an ingredient photo in
 * /public/notes. Matching is keyword-based so qualifiers like "Калабрийский
 * бергамот" or "Сицилийский апельсин" still resolve to the base ingredient.
 *
 * Order matters where one keyword is a substring of another: more specific
 * entries (e.g. "тубероза", which contains "роза") must come first.
 */
const NOTE_IMAGES: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["bergamot", ["бергамот", "bergamot"]],
  ["grapefruit", ["грейпфрут", "greypfrut"]],
  ["mandarin", ["мандарин", "mandarin"]],
  ["orange", ["апельсин", "apelsin"]],
  ["citron", ["цитрон", "sitron"]],
  ["ginger", ["имбир", "zanjabil"]],
  ["cinnamon", ["кориц", "dolchin"]],
  ["blacktea", ["чай", "choy", "choy"]],
  ["neroli", ["нероли", "neroli"]],
  ["tuberose", ["тубероза", "tuberoza"]],
  ["rose", ["роза", "atirgul"]],
  ["jasmine", ["жасмин", "jasmin"]],
  ["gardenia", ["гардени", "gardeniy"]],
  ["frangipani", ["франжипани", "franjipani"]],
  ["carnation", ["гвоздик", "chinnigul"]],
  ["iris", ["ирис", "iris"]],
  ["pearblossom", ["груш", "nok guli"]],
  ["redberries", ["ягод", "rezavor"]],
  ["honey", ["мёд", "мед", "asal"]],
  ["blackcurrantleaf", ["смородин", "smorodina"]],
  ["sugarcane", ["тростник", "qamish", "shakar"]],
  ["frankincense", ["олибанум", "olibanum", "ладан"]],
  ["guaiac", ["гваяк", "gvayak"]],
  ["oakmoss", ["мох", "moxi"]],
  ["patchouli", ["пачули", "pachuli"]],
  // "амбра", "амброксан", "серая амбра", "amber", "ambroksan" → one amber stone
  ["amber", ["амбр", "amber", "ambroks"]],
]

/** Resolve a note name to its ingredient photo path, or null if none matches. */
export function noteImage(note: string): string | null {
  const text = note.toLowerCase()
  for (const [key, keywords] of NOTE_IMAGES) {
    if (keywords.some((kw) => text.includes(kw))) return `/notes/${key}.jpg`
  }
  return null
}
