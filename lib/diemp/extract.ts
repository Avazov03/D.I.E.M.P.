import type { Draft } from "@/lib/diemp/db"

const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"]

const SYSTEM = `Sen hujjatdan maydon ajratuvchisan. Faqat berilgan matndan ol.
Qoidalar:
- Matnda yo'q sana, tashkilot, raqam va topshiriqni yozma. Yo'q maydon null qoladi.
- Har bir topshiriq uchun matndan qisqa parchasi ni aynan ko'chir.
- Jismoniy va moliyaviy foizni o'ylab topma.
- Maxfiy deb taxmin qilma va maxfiy matn to'qima.
- Bu ajratma rasmiy qaror emas. Odam tasdiqlamaguncha topshiriq hisoblanmaydi.`

const schema = {
  type: "OBJECT",
  properties: {
    raqam: { type: "STRING", nullable: true },
    nomi: { type: "STRING", nullable: true },
    sana: { type: "STRING", nullable: true },
    topshiriqlar: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          matn: { type: "STRING" },
          muddat: { type: "STRING", nullable: true },
          tashkilot: { type: "STRING", nullable: true },
          parchasi: { type: "STRING" },
        },
        required: ["matn", "muddat", "tashkilot", "parchasi"],
      },
    },
    aniqlanmagan: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["raqam", "nomi", "sana", "topshiriqlar", "aniqlanmagan"],
}

function textOf(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function extractDraft(source: string): Promise<Draft> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("Kalit sozlanmagan")
  const clipped = source.slice(0, 15000)
  const payload = clipped.length < source.length
    ? `${clipped}\n\n[Matn shu yerda kesildi. Kesilgan qismdan maydon olmang.]`
    : clipped

  let lastError = "AI xizmati javob bermadi"
  for (const model of MODELS) {
    let response: Response
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: payload }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
            responseSchema: schema,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
        signal: AbortSignal.timeout(40000),
      })
    } catch {
      continue
    }
    if (response.status === 404 || response.status === 429 || response.status === 503) continue
    if (!response.ok) {
      lastError = response.status === 401 || response.status === 403 ? "Kalit qabul qilinmadi" : "AI xizmati javob bermadi"
      if (response.status === 401 || response.status === 403) throw new Error(lastError)
      continue
    }
    const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? ""
    const parsed = JSON.parse(raw) as { raqam?: unknown; nomi?: unknown; sana?: unknown; topshiriqlar?: unknown; aniqlanmagan?: unknown }
    const tasks = Array.isArray(parsed.topshiriqlar) ? parsed.topshiriqlar : []
    return {
      raqam: textOf(parsed.raqam),
      nomi: textOf(parsed.nomi),
      sana: textOf(parsed.sana),
      aniqlanmagan: Array.isArray(parsed.aniqlanmagan) ? parsed.aniqlanmagan.filter((item): item is string => typeof item === "string") : [],
      topshiriqlar: tasks.slice(0, 30).map((item) => {
        const row = item as { matn?: unknown; muddat?: unknown; tashkilot?: unknown; parchasi?: unknown }
        return { matn: textOf(row.matn), muddat: textOf(row.muddat), tashkilot: textOf(row.tashkilot), parchasi: textOf(row.parchasi) }
      }).filter((task) => task.matn),
    }
  }
  throw new Error(lastError)
}
