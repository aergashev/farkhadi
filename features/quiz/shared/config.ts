import type { Archetype, LB, ProductSlug, QuizQuestion } from "./types"

/**
 * The four questions: mood → aura → scene → style.
 * Each option adds +1 to its target perfume.
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
        emoji: "🌸",
        target: "gucci-gardena",
        label: { uz: "Yumshoq, romantik, nafis", ru: "Мягкое, романтичное, нежное" },
      },
      {
        emoji: "🌊",
        target: "afternoon-swim",
        label: { uz: "Quyoshli, erkin, yengil", ru: "Солнечное, свободное, лёгкое" },
      },
      {
        emoji: "🌙",
        target: "imagination",
        label: { uz: "Sirli, chuqur, jozibali", ru: "Загадочное, глубокое, притягательное" },
      },
      {
        emoji: "🎼",
        target: "symphoniya",
        label: { uz: "Ijodkor, nozik, ilhomli", ru: "Творческое, тонкое, вдохновлённое" },
      },
      {
        emoji: "⚡",
        target: "creation",
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
        emoji: "🌸",
        target: "gucci-gardena",
        label: { uz: "“Juda nafis va yoqimli”", ru: "«Очень нежно и изящно»" },
      },
      {
        emoji: "🌊",
        target: "afternoon-swim",
        label: { uz: "“Unda yozgi erkinlik bor”", ru: "«В нём есть летняя свобода»" },
      },
      {
        emoji: "🌙",
        target: "imagination",
        label: {
          uz: "“Qandaydir sirli jozibasi bor”",
          ru: "«Есть какая-то загадочная притягательность»",
        },
      },
      {
        emoji: "🎼",
        target: "symphoniya",
        label: {
          uz: "“Juda o‘ziga xos va ilhomli”",
          ru: "«Очень особенная, вдохновляющая энергия»",
        },
      },
      {
        emoji: "⚡",
        target: "creation",
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
        emoji: "🌸",
        target: "gucci-gardena",
        label: {
          uz: "Gullar, sokin musiqa va romantik uchrashuv",
          ru: "Цветы, тихая музыка и романтичная встреча",
        },
      },
      {
        emoji: "🌊",
        target: "afternoon-swim",
        label: {
          uz: "Quyosh, suv, yengil shamol va kulgi",
          ru: "Солнце, вода, лёгкий ветер и смех",
        },
      },
      {
        emoji: "🌙",
        target: "imagination",
        label: {
          uz: "Tungi shahar, chiroqlar va sirli nigoh",
          ru: "Ночной город, огни и загадочный взгляд",
        },
      },
      {
        emoji: "🎼",
        target: "symphoniya",
        label: {
          uz: "Piano ovozi, san’at va chiroyli fikrlar",
          ru: "Звук пианино, искусство и красивые мысли",
        },
      },
      {
        emoji: "⚡",
        target: "creation",
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
        emoji: "🌸",
        target: "gucci-gardena",
        label: {
          uz: "“Men nozikman, lekin esda qolaman.”",
          ru: "«Я нежный, но меня запоминают.»",
        },
      },
      {
        emoji: "🌊",
        target: "afternoon-swim",
        label: {
          uz: "“Men yengillik va erkinlikni tanlayman.”",
          ru: "«Я выбираю лёгкость и свободу.»",
        },
      },
      {
        emoji: "🌙",
        target: "imagination",
        label: {
          uz: "“Menda aytilmagan sir bor.”",
          ru: "«Во мне есть неразгаданная тайна.»",
        },
      },
      {
        emoji: "🎼",
        target: "symphoniya",
        label: {
          uz: "“Men oddiy emasman, men ilhomman.”",
          ru: "«Я не обычный аромат, я вдохновение.»",
        },
      },
      {
        emoji: "⚡",
        target: "creation",
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
    emoji: "🌸",
    name: { uz: "Romantik Aura", ru: "Романтичная аура" },
    personality: {
      uz: "Men nozik, nafis va esda qoladigan obrazman.",
      ru: "Я нежная, изящная и запоминающаяся.",
    },
  },
  symphoniya: {
    slug: "symphoniya",
    emoji: "🎼",
    name: { uz: "Ilhom Muzasi", ru: "Муза вдохновения" },
    personality: {
      uz: "Men oddiy emasman — menda ilhom va o‘ziga xoslik bor.",
      ru: "Я не обычная — во мне вдохновение и индивидуальность.",
    },
  },
  imagination: {
    slug: "imagination",
    emoji: "🌙",
    name: { uz: "Tungi Sehr", ru: "Ночное волшебство" },
    personality: {
      uz: "Men sirli, chuqur va esda qoladigan obrazman.",
      ru: "Я загадочная, глубокая и запоминающаяся.",
    },
  },
  "afternoon-swim": {
    slug: "afternoon-swim",
    emoji: "🌊",
    name: { uz: "Erkin Ruh", ru: "Свободный дух" },
    personality: {
      uz: "Men yengil, quyoshli va erkin energiyani tanlayman.",
      ru: "Я выбираю лёгкость, солнце и свободную энергию.",
    },
  },
  creation: {
    slug: "creation",
    emoji: "⚡",
    name: { uz: "Jasur Kontrast", ru: "Смелый контраст" },
    personality: {
      uz: "Men kirgan joyda obrazim seziladi.",
      ru: "Когда я появляюсь, мой образ чувствуется.",
    },
  },
}

/** UI chrome copy for the quiz. */
export const QUIZ_UI = {
  introEyebrow: { uz: "FarKhadi ifor testi", ru: "Тест ароматов FarKhadi" },
  introTitle: {
    uz: "Qaysi FarKhadi ifori sizniki?",
    ru: "Какой аромат FarKhadi — ваш?",
  },
  introSubtitle: {
    uz: "4 ta savolga javob bering — FarKhadi sizning kayfiyatingizga mos iforni topadi.",
    ru: "Ответьте на 4 вопроса — FarKhadi подберёт аромат под ваше настроение.",
  },
  introNote: { uz: "Email yoki telefon shart emas.", ru: "Без email и телефона." },
  start: { uz: "Testni boshlash ✨", ru: "Начать тест ✨" },
  questionWord: { uz: "Savol", ru: "Вопрос" },
  loading: [
    { uz: "Kayfiyatingiz tekshirilmoqda…", ru: "Проверяем ваше настроение…" },
    { uz: "Sizga mos aura topilmoqda…", ru: "Подбираем вашу ауру…" },
    { uz: "Iforingiz aralashtirilmoqda…", ru: "Смешиваем ваш аромат…" },
    { uz: "Natija tayyor ✨", ru: "Результат готов ✨" },
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
  giftCta: {
    uz: "Telegram orqali sovg‘a chegirma olish",
    ru: "Получить подарочную скидку в Telegram",
  },
  // Share card
  shareLabel: { uz: "FarKhadi ifor testi", ru: "Тест ароматов FarKhadi" },
  shareMyResult: { uz: "Mening natijam:", ru: "Мой результат:" },
  shareMatch: { uz: "Menga mos ifor:", ru: "Мой аромат:" },
  shareCtaTitle: { uz: "Seniki qaysi?", ru: "А какой твой?" },
  shareCtaSub: {
    uz: "30 soniyada testingizni o‘ting.",
    ru: "Пройди тест за 30 секунд.",
  },
  shareBtn: { uz: "Natijani ulashish", ru: "Поделиться результатом" },
  saveStory: { uz: "Story uchun saqlash", ru: "Сохранить для Story" },
  shareTitle: { uz: "FarKhadi ifor testi", ru: "Тест ароматов FarKhadi" },
  linkCopied: { uz: "Havola nusxalandi ✨", ru: "Ссылка скопирована ✨" },
  storyHint: {
    uz: "Kartani skrinshot qiling va Story’ga joylang ✨",
    ru: "Сделайте скриншот карточки и добавьте в Story ✨",
  },
  // Homepage teaser
  teaserTitle: { uz: "Qaysi FarKhadi ifori sizniki?", ru: "Какой аромат FarKhadi — ваш?" },
  teaserSubtitle: {
    uz: "4 ta savolga javob bering. FarKhadi sizning kayfiyatingizga mos iforni topadi.",
    ru: "Ответьте на 4 вопроса. FarKhadi подберёт аромат под ваше настроение.",
  },
  teaserNote: { uz: "Email yoki telefon shart emas.", ru: "Без email и телефона." },
} satisfies Record<string, LB | LB[]>

/** Telegram handle used by the optional after-result gift CTA. */
export const TELEGRAM_URL = "https://t.me/farkhadiparfum"
