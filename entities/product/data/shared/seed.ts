import type { Product } from "./types"
import { DEFAULT_PRICE, DEFAULT_VOLUME_ML } from "./types"

/**
 * Initial FarKhadi catalogue. Fragrance pyramids are taken directly from the
 * official product photos. Used to seed the store on first run.
 */
export const SEED_PRODUCTS: Product[] = [
  {
    id: "imagination",
    slug: "imagination",
    name: { uz: "Imagination", ru: "Imagination" },
    tagline: {
      uz: "Tutunli sharqona, ziravorli iliqlik",
      ru: "Дымчатый восточный, пряное тепло",
    },
    description: {
      uz: "Imagination — sitrus uchqunlari ziravorlar va qimmatbaho daraxtlar issiqligida eriydigan jasur sharqona ifor. Kuchli xarakterga ega, kechki paytlar uchun mukammal.",
      ru: "Imagination — смелый восточный аромат, где цитрусовые искры тают в тепле специй и драгоценных пород дерева. Характерный и глубокий, идеален для вечера.",
    },
    notes: {
      top: {
        uz: ["Kalabriya bergamoti", "Sitsiliya apelsini", "Sitron"],
        ru: ["Калабрийский бергамот", "Сицилийский апельсин", "Цитрон"],
      },
      heart: {
        uz: ["Nigeriya zanjabili", "Seylon dolchini", "Neroli", "Xitoy qora choyi"],
        ru: ["Нигерийский имбирь", "Цейлонская корица", "Нероли", "Китайский чёрный чай"],
      },
      base: {
        uz: ["Ambroksan", "Olibanum", "Gvayak daraxti"],
        ru: ["Амброксан", "Олибанум", "Гваяковое дерево"],
      },
    },
    price: DEFAULT_PRICE,
    volumeMl: DEFAULT_VOLUME_ML,
    image: "/products/imagination.jpg",
    accent: "#c9a24b",
    active: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "symphoniya",
    slug: "symphoniya",
    name: { uz: "Symphoniya", ru: "Symphoniya" },
    tagline: {
      uz: "Iliq sitrus va amber simfoniyasi",
      ru: "Симфония тёплого цитруса и амбры",
    },
    description: {
      uz: "Symphoniya — yorqin sitrus ochilishi amber va mushkning baxmal asosiga aylanadigan nafis kompozitsiya. Sharqona nafosat va ayollik nozikligi uyg‘unligi.",
      ru: "Symphoniya — изящная композиция, где яркое цитрусовое вступление переходит в бархатную базу из амбры и мускуса. Восточная грация и женственная нежность.",
    },
    notes: {
      top: {
        uz: ["Bergamot", "Apelsin"],
        ru: ["Бергамот", "Апельсин"],
      },
      heart: {
        uz: ["Greypfrut", "Zanjabil"],
        ru: ["Грейпфрут", "Имбирь"],
      },
      base: {
        uz: ["Amber", "Mushk"],
        ru: ["Амбра", "Мускус"],
      },
    },
    price: DEFAULT_PRICE,
    volumeMl: DEFAULT_VOLUME_ML,
    image: "/products/simphoniya.jpg",
    accent: "#8c2436",
    active: true,
    featured: true,
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "gucci-gardena",
    slug: "gucci-gardena",
    name: { uz: "Gucci Gardena", ru: "Gucci Gardena" },
    tagline: {
      uz: "Oppoq gullarning yashil bog‘i",
      ru: "Зелёный сад из белых цветов",
    },
    description: {
      uz: "Gucci Gardena — gardeniya, jasmin va franjipani ochilgan yam-yashil gulzor. Mandarin va qizil rezavorlar yengillik baxsh etadi, pachuli esa chuqurlik beradi.",
      ru: "Gucci Gardena — цветущий сад, где раскрываются гардения, жасмин и франжипани. Мандарин и красные ягоды добавляют лёгкости, а пачули — глубины.",
    },
    notes: {
      top: {
        uz: ["Mandarin", "Qizil rezavorlar", "Nok guli"],
        ru: ["Мандарин", "Красные ягоды", "Цветок груши"],
      },
      heart: {
        uz: ["Oq gardeniya", "Jasmin", "Franjipani"],
        ru: ["Белая гардения", "Жасмин", "Франжипани"],
      },
      base: {
        uz: ["Pachuli", "Qamish shakari"],
        ru: ["Пачули", "Тростниковый сахар"],
      },
    },
    price: DEFAULT_PRICE,
    volumeMl: DEFAULT_VOLUME_ML,
    image: "/products/gucci_gardena.jpg",
    accent: "#1f6b4a",
    active: true,
    featured: true,
    createdAt: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "afternoon-swim",
    slug: "afternoon-swim",
    name: { uz: "Afternoon Swim", ru: "Afternoon Swim" },
    tagline: {
      uz: "Salqin sitrusli yangilik",
      ru: "Прохладная цитрусовая свежесть",
    },
    description: {
      uz: "Afternoon Swim — quyoshli sitrus va zanjabilning yorqin yangiligi kulrang amberning mayin to‘lqinida tinchlanadi. Yengil, toza va kunduzgi kayfiyat uchun.",
      ru: "Afternoon Swim — яркая свежесть солнечного цитруса и имбиря, утихающая в мягкой волне серой амбры. Лёгкий, чистый, для дневного настроения.",
    },
    notes: {
      top: {
        uz: ["Sitsiliya apelsini", "Mandarin", "Bergamot"],
        ru: ["Сицилийский апельсин", "Мандарин", "Бергамот"],
      },
      heart: {
        uz: ["Zanjabil"],
        ru: ["Имбирь"],
      },
      base: {
        uz: ["Kulrang amber"],
        ru: ["Серая амбра"],
      },
    },
    price: DEFAULT_PRICE,
    volumeMl: DEFAULT_VOLUME_ML,
    image: "/products/afternoon_swim.jpg",
    accent: "#3a6ea5",
    active: true,
    featured: false,
    createdAt: "2026-01-04T00:00:00.000Z",
  },
  {
    id: "creation",
    slug: "creation",
    name: { uz: "Creation", ru: "Creation" },
    tagline: {
      uz: "Suvli gulli, nafis yangilanish",
      ru: "Водный цветочный, утончённое обновление",
    },
    description: {
      uz: "Creation — qora smorodina va amber uchqunlari atirgul va jasminning nafis yuragiga ochiladigan suvli gulli ifor. Sandal va mox bilan toza, zamonaviy yakun.",
      ru: "Creation — водный цветочный аромат, где искры чёрной смородины и амбры раскрываются в изящном сердце из розы и жасмина. Чистый, современный финал из сандала и мха.",
    },
    notes: {
      top: {
        uz: ["Qora smorodina", "Amber akkordi"],
        ru: ["Чёрная смородина", "Аккорд амбры"],
      },
      heart: {
        uz: ["Atirgul", "Jasmin", "Apelsin guli"],
        ru: ["Роза", "Жасмин", "Цветок апельсина"],
      },
      base: {
        uz: ["Sandal daraxti", "Eman moxi", "Mushk"],
        ru: ["Сандал", "Дубовый мох", "Мускус"],
      },
    },
    price: DEFAULT_PRICE,
    volumeMl: DEFAULT_VOLUME_ML,
    image: "/products/creation.jpg",
    accent: "#5f86ad",
    active: true,
    featured: false,
    createdAt: "2026-01-05T00:00:00.000Z",
  },
]
