import type {
  Archetype,
  Gender,
  LB,
  ProductSlug,
  QuizQuestion,
  Weights,
} from "./types"

/** Unisex perfumes are eligible for everyone; female-only for women. */
export const UNISEX_SLUGS: ProductSlug[] = [
  "creation",
  "afternoon-swim",
  "imagination",
]
export const FEMALE_ONLY_SLUGS: ProductSlug[] = ["gucci-gardena", "symphoniya"]

/**
 * Perfumes a user can be matched with. Women → all; men or "not sure yet"
 * (a safe, gender-neutral gift) → unisex only.
 */
export function eligibleFor(gender: Gender): ProductSlug[] {
  return gender === "female"
    ? [...UNISEX_SLUGS, ...FEMALE_ONLY_SLUGS]
    : UNISEX_SLUGS
}

/**
 * Each answer leans primarily to one perfume (+2) and secondarily to a
 * thematically adjacent unisex one (+1), so a romantic/creative man still gets
 * a sensible match. The option icon is that perfume's vibe icon.
 */
const LEAN: Record<ProductSlug, Weights> = {
  "gucci-gardena": { "gucci-gardena": 2, imagination: 1 },
  symphoniya: { symphoniya: 2, creation: 1 },
  imagination: { imagination: 2, creation: 1 },
  "afternoon-swim": { "afternoon-swim": 2, imagination: 1 },
  creation: { creation: 2, imagination: 1 },
}

export const GENDER_QUESTION = {
  title: { uz: "Kimga sovg‘a qilamiz?", ru: "Кому дарим аромат?" } as LB,
  options: [
    {
      value: "female" as Gender,
      icon: "female" as const,
      label: { uz: "Ayolga", ru: "Женщине" } as LB,
    },
    {
      value: "male" as Gender,
      icon: "male" as const,
      label: { uz: "Erkakka", ru: "Мужчине" } as LB,
    },
    {
      value: "unknown" as Gender,
      icon: "unknown" as const,
      label: { uz: "Hali bilmayman", ru: "Пока не знаю" } as LB,
    },
  ],
}

/**
 * Four questions: mood → aura → scene → style.
 * Icons share one visual language (gold-stroke SVGs) and options are shuffled
 * at runtime, so the mapping is never obvious from position.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "mood",
    title: {
      uz: "Bugun sizning kayfiyatingiz qaysi?",
      ru: "Какое у вас сегодня настроение?",
    },
    options: [
      {
        icon: "flower",
        weights: LEAN["gucci-gardena"],
        label: { uz: "Yumshoq, romantik, nafis", ru: "Мягкое, романтичное, нежное" },
      },
      {
        icon: "waves",
        weights: LEAN["afternoon-swim"],
        label: { uz: "Quyoshli, erkin, yengil", ru: "Солнечное, свободное, лёгкое" },
      },
      {
        icon: "moon",
        weights: LEAN.imagination,
        label: { uz: "Sirli, chuqur, jozibali", ru: "Загадочное, глубокое, притягательное" },
      },
      {
        icon: "music",
        weights: LEAN.symphoniya,
        label: { uz: "Ijodkor, nozik, ilhomli", ru: "Творческое, тонкое, вдохновлённое" },
      },
      {
        icon: "bolt",
        weights: LEAN.creation,
        label: { uz: "Jasur, ishonchli, kuchli", ru: "Смелое, уверенное, сильное" },
      },
    ],
  },
  {
    id: "aura",
    title: {
      uz: "Siz kirgan joyda odamlar siz haqingizda nima deb o‘ylashini xohlaysiz?",
      ru: "Что люди должны почувствовать, когда вы входите?",
    },
    options: [
      {
        icon: "flower",
        weights: LEAN["gucci-gardena"],
        label: { uz: "“Juda nafis va yoqimli”", ru: "«Очень нежно и изящно»" },
      },
      {
        icon: "waves",
        weights: LEAN["afternoon-swim"],
        label: { uz: "“Unda yozgi erkinlik bor”", ru: "«В нём есть летняя свобода»" },
      },
      {
        icon: "moon",
        weights: LEAN.imagination,
        label: {
          uz: "“Qandaydir sirli jozibasi bor”",
          ru: "«Есть какая-то загадочная притягательность»",
        },
      },
      {
        icon: "music",
        weights: LEAN.symphoniya,
        label: {
          uz: "“Juda o‘ziga xos va ilhomli”",
          ru: "«Очень особенная, вдохновляющая энергия»",
        },
      },
      {
        icon: "bolt",
        weights: LEAN.creation,
        label: { uz: "“U o‘ziga juda ishonadi”", ru: "«Видно, что человек уверен в себе»" },
      },
    ],
  },
  {
    id: "scene",
    title: {
      uz: "Qaysi sahna sizga ko‘proq mos?",
      ru: "Какая сцена больше похожа на вас?",
    },
    options: [
      {
        icon: "flower",
        weights: LEAN["gucci-gardena"],
        label: {
          uz: "Gullar, sokin musiqa va romantik uchrashuv",
          ru: "Цветы, тихая музыка и романтичная встреча",
        },
      },
      {
        icon: "waves",
        weights: LEAN["afternoon-swim"],
        label: {
          uz: "Quyosh, suv, yengil shamol va kulgi",
          ru: "Солнце, вода, лёгкий ветер и смех",
        },
      },
      {
        icon: "moon",
        weights: LEAN.imagination,
        label: {
          uz: "Tungi shahar, chiroqlar va sirli nigoh",
          ru: "Ночной город, огни и загадочный взгляд",
        },
      },
      {
        icon: "music",
        weights: LEAN.symphoniya,
        label: {
          uz: "Piano ovozi, san’at va chiroyli fikrlar",
          ru: "Звук пианино, искусство и красивые мысли",
        },
      },
      {
        icon: "bolt",
        weights: LEAN.creation,
        label: {
          uz: "Muhim kun, kuchli obraz va katta kirish",
          ru: "Важный день, сильный образ и эффектное появление",
        },
      },
    ],
  },
  {
    id: "style",
    title: {
      uz: "Sizning iforingiz bir jumla bo‘lsa, u nima derdi?",
      ru: "Если бы ваш аромат говорил одной фразой, что бы он сказал?",
    },
    options: [
      {
        icon: "flower",
        weights: LEAN["gucci-gardena"],
        label: {
          uz: "“Men nozikman, lekin esda qolaman.”",
          ru: "«Я нежный, но меня запоминают.»",
        },
      },
      {
        icon: "waves",
        weights: LEAN["afternoon-swim"],
        label: {
          uz: "“Men yengillik va erkinlikni tanlayman.”",
          ru: "«Я выбираю лёгкость и свободу.»",
        },
      },
      {
        icon: "moon",
        weights: LEAN.imagination,
        label: {
          uz: "“Menda aytilmagan sir bor.”",
          ru: "«Во мне есть неразгаданная тайна.»",
        },
      },
      {
        icon: "music",
        weights: LEAN.symphoniya,
        label: {
          uz: "“Men oddiy emasman, men ilhomman.”",
          ru: "«Я не обычный аромат, я вдохновение.»",
        },
      },
      {
        icon: "bolt",
        weights: LEAN.creation,
        label: {
          uz: "“Men kirgan joyda e’tibor menda bo‘ladi.”",
          ru: "«Когда я появляюсь, внимание на мне.»",
        },
      },
    ],
  },
]

/** Archetype (vibe) per perfume. The product name itself never changes. */
export const ARCHETYPES: Record<ProductSlug, Archetype> = {
  "gucci-gardena": {
    slug: "gucci-gardena",
    icon: "flower",
    name: { uz: "Romantik Aura", ru: "Романтичная аура" },
    personality: {
      uz: "Men nozik, nafis va esda qoladigan obrazman.",
      ru: "Я нежная, изящная и запоминающаяся.",
    },
  },
  symphoniya: {
    slug: "symphoniya",
    icon: "music",
    name: { uz: "Ilhom Muzasi", ru: "Муза вдохновения" },
    personality: {
      uz: "Men oddiy emasman — menda ilhom va o‘ziga xoslik bor.",
      ru: "Я не обычная — во мне вдохновение и индивидуальность.",
    },
  },
  imagination: {
    slug: "imagination",
    icon: "moon",
    name: { uz: "Tungi Sehr", ru: "Ночное волшебство" },
    personality: {
      uz: "Men sirli, chuqur va esda qoladigan obrazman.",
      ru: "Я загадочная, глубокая и запоминающаяся.",
    },
  },
  "afternoon-swim": {
    slug: "afternoon-swim",
    icon: "waves",
    name: { uz: "Erkin Ruh", ru: "Свободный дух" },
    personality: {
      uz: "Men yengil, quyoshli va erkin energiyani tanlayman.",
      ru: "Я выбираю лёгкость, солнце и свободную энергию.",
    },
  },
  creation: {
    slug: "creation",
    icon: "bolt",
    name: { uz: "Jasur Kontrast", ru: "Смелый контраст" },
    personality: {
      uz: "Men kirgan joyda obrazim seziladi.",
      ru: "Когда я появляюсь, мой образ чувствуется.",
    },
  },
}

/** Fixed product display names (used by admin analytics). Never localised. */
export const PRODUCT_DISPLAY_NAMES: Record<ProductSlug, string> = {
  "gucci-gardena": "Gucci Gardena",
  symphoniya: "Symphoniya",
  imagination: "Imagination",
  "afternoon-swim": "Afternoon Swim",
  creation: "Creation",
}

/** Archetypes featured as preview cards on the homepage teaser. */
export const TEASER_PREVIEWS: ProductSlug[] = [
  "imagination",
  "gucci-gardena",
  "afternoon-swim",
]

/** UI chrome copy for the quiz. */
export const QUIZ_UI = {
  introEyebrow: { uz: "FarKhadi ifor testi", ru: "Тест ароматов FarKhadi" },
  introTitle: {
    uz: "Qaysi FarKhadi ifori sizniki?",
    ru: "Какой аромат FarKhadi — ваш?",
  },
  introSubtitle: {
    uz: "Bir necha savol — va FarKhadi sizning kayfiyatingizga mos iforni topadi.",
    ru: "Несколько вопросов — и FarKhadi подберёт аромат под ваше настроение.",
  },
  introNote: { uz: "Email yoki telefon shart emas.", ru: "Без email и телефона." },
  start: { uz: "Testni boshlash", ru: "Начать тест" },
  genderTitle: { uz: "Kimga sovg‘a qilamiz?", ru: "Кому дарим аромат?" },
  questionWord: { uz: "Savol", ru: "Вопрос" },
  loading: [
    { uz: "Kayfiyatingiz tekshirilmoqda…", ru: "Проверяем ваше настроение…" },
    { uz: "Sizga mos aura topilmoqda…", ru: "Подбираем вашу ауру…" },
    { uz: "Iforingiz aralashtirilmoqda…", ru: "Смешиваем ваш аромат…" },
    { uz: "Natija tayyor", ru: "Результат готов" },
  ] as LB[],
  resultYouAre: { uz: "Siz —", ru: "Вы —" },
  resultMatch: { uz: "Sizga mos ifor:", ru: "Ваш аромат:" },
  addToCart: {
    uz: "Bu mening iforim — savatga qo‘shish",
    ru: "Это мой аромат — в корзину",
  },
  viewProduct: { uz: "Batafsil ko‘rish", ru: "Подробнее" },
  runnerUp: {
    uz: "Sizga yana mos kelishi mumkin:",
    ru: "Вам также может подойти:",
  },
  retake: { uz: "Qayta urinish", ru: "Пройти заново" },
  // Share card
  shareLabel: { uz: "FarKhadi ifor testi", ru: "Тест ароматов FarKhadi" },
  shareMyResult: { uz: "Mening natijam:", ru: "Мой результат:" },
  shareMatch: { uz: "Menga mos ifor:", ru: "Мой аромат:" },
  shareCtaTitle: { uz: "Seniki qaysi?", ru: "А какой твой?" },
  shareCtaSub: {
    uz: "30 soniyada testingizni o‘ting.",
    ru: "Пройди тест за 30 секунд.",
  },
  shareHeading: {
    uz: "Natijangizni do‘stlaringiz bilan ulashing",
    ru: "Поделитесь результатом с друзьями",
  },
  shareToInstagram: { uz: "Instagram’ga ulashish", ru: "Поделиться в Instagram" },
  savePhoto: { uz: "Rasmni saqlash", ru: "Сохранить фото" },
  preparing: { uz: "Rasm tayyorlanmoqda…", ru: "Готовим изображение…" },
  shareTitle: { uz: "FarKhadi ifor testi", ru: "Тест ароматов FarKhadi" },
  photoSaved: { uz: "Rasm saqlandi", ru: "Фото сохранено" },
  shareError: {
    uz: "Ulashib bo‘lmadi. Rasm saqlandi — Story’ga qo‘ying.",
    ru: "Не удалось поделиться. Фото сохранено — добавьте в Story.",
  },
  // Homepage teaser
  teaserTitle: { uz: "Qaysi FarKhadi ifori sizniki?", ru: "Какой аромат FarKhadi — ваш?" },
  teaserSubtitle: {
    uz: "Bir necha savolga javob bering — FarKhadi sizning kayfiyatingizga mos iforni topadi.",
    ru: "Ответьте на несколько вопросов — FarKhadi подберёт аромат под ваше настроение.",
  },
  teaserNote: { uz: "Email yoki telefon shart emas.", ru: "Без email и телефона." },
} satisfies Record<string, LB | LB[]>
