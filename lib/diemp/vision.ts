export type MatchResult = {
  nimaKorindi: string
  moslik: "mos" | "mos_emas" | "aniqlanmagan"
  sabab: string
}

const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"]

const SYSTEM = `Sen dalil rasmini ko'rib chiquvchisan. Faqat rasmda haqiqatan ko'ringan narsani yoz.
Qoidalar:
- Rasmda yo'q buyum, sana, tashkilot va yozuvni qo'shma.
- Topshiriq so'ragan narsa rasmda aniq ko'rinsa moslik "mos".
- Boshqa narsa ko'rinsa moslik "mos_emas".
- Rasm noaniq bo'lsa moslik "aniqlanmagan".
- Bu tekshiruv rasmiy dalil tasdig'i emas. Odam qaror qiladi.`

const schema = {
  type: "OBJECT",
  properties: {
    nimaKorindi: { type: "STRING" },
    moslik: { type: "STRING", enum: ["mos", "mos_emas", "aniqlanmagan"] },
    sabab: { type: "STRING" },
  },
  required: ["nimaKorindi", "moslik", "sabab"],
}

function clip(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : ""
}

export async function matchEvidence(task: string, note: string, mime: string, bytes: Buffer): Promise<MatchResult> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("Kalit sozlanmagan")
  const prompt = `Topshiriq: ${task}\nDalil izohi: ${note}\nRasmni ko'r va topshiriqqa dalil sifatida mosligini ayt.`
  let lastError = "AI hozir javob chegarasida. Birozdan keyin qayta bosing."
  for (const model of MODELS) {
    const generationConfig: Record<string, unknown> = {
      temperature: 0.1,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      responseSchema: schema,
    }
    if (!model.endsWith("lite")) generationConfig.thinkingConfig = { thinkingBudget: 0 }
    let response: Response
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: mime, data: bytes.toString("base64") } },
            ],
          }],
          generationConfig,
        }),
        signal: AbortSignal.timeout(40000),
      })
    } catch {
      continue
    }
    if (response.status === 404 || response.status === 400 || response.status === 429 || response.status === 503) continue
    if (!response.ok) {
      lastError = response.status === 401 || response.status === 403 ? "Kalit qabul qilinmadi" : lastError
      if (response.status === 401 || response.status === 403) throw new Error(lastError)
      continue
    }
    const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? ""
    try {
      const parsed = JSON.parse(raw) as { nimaKorindi?: unknown; moslik?: unknown; sabab?: unknown }
      const moslik = parsed.moslik === "mos" || parsed.moslik === "mos_emas" || parsed.moslik === "aniqlanmagan" ? parsed.moslik : "aniqlanmagan"
      return { nimaKorindi: clip(parsed.nimaKorindi), moslik, sabab: clip(parsed.sabab) }
    } catch {
      continue
    }
  }
  throw new Error(lastError)
}
