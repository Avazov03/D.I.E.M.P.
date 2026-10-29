import { documentById, saveImpacts, storedDecisions, storedTasks } from "@/lib/diemp/db"
import { isSecretText } from "@/lib/diemp/read-file"
import { statistics } from "@/lib/diemp/stat-catalog"
import { acceptProposal, proposalsFromText, type Proposal } from "@/lib/diemp/stat-math"

const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"]

const schema = {
  type: "OBJECT",
  properties: {
    tasirlar: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          statistika: { type: "STRING", enum: statistics.map((item) => item.id) },
          belgi: { type: "STRING", enum: ["+", "-"] },
          miqdor: { type: "NUMBER" },
          parchasi: { type: "STRING" },
        },
        required: ["statistika", "belgi", "miqdor", "parchasi"],
      },
    },
  },
  required: ["tasirlar"],
}

async function askImpacts(text: string): Promise<Proposal[]> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return []
  const prompt = `Matn:\n${text.slice(0, 7000)}\n\nQaysi statistikaga aniq son bilan ta'sir bor?`
  const system = `Sen qaror matnini statistikaga bog'laysan.
Ruxsat etilgan statistika: band (ish bilan band aholi, kishi), faol (iqtisodiy faol aholi, kishi), ishsizlik (foiz punkti), tadbirkor (tadbirkorlik subyekti, ta).
Qoidalar:
- Miqdor matnda yozilgan bo'lsin. Yo'q sonni to'qima.
- parchasi matndan aynan olingan gap bo'lsin.
- Universitet ishchi normasi, shtat, ish o'rni band ga yoziladi. Ish o'rnini ishsizlik foiziga aylantirma.
- Yangi ish o'rni yoki subyekt belgi "+", qisqartirish yoki tugatish belgi "-".
- Aniq son yo'q bo'lsa tasirlar bo'sh qoladi.
- Rasmiy statistika jadvalidagi yirik yillik sonni qaror ta'siri deb yozma.`
  for (const model of MODELS) {
    const generationConfig: Record<string, unknown> = {
      temperature: 0.1,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      responseSchema: schema,
    }
    if (!model.endsWith("lite")) generationConfig.thinkingConfig = { thinkingBudget: 0 }
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig,
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (response.status === 400 || response.status === 404 || response.status === 429 || response.status === 503) continue
      if (!response.ok) continue
      const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
      const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? ""
      const parsed = JSON.parse(raw) as { tasirlar?: { statistika?: string; belgi?: string; miqdor?: number; parchasi?: string }[] }
      return (parsed.tasirlar ?? []).flatMap((item) => {
        const proposal: Proposal = {
          statistika: item.statistika === "band" || item.statistika === "faol" || item.statistika === "ishsizlik" || item.statistika === "tadbirkor" ? item.statistika : "band",
          belgi: item.belgi === "-" ? "-" : "+",
          miqdor: typeof item.miqdor === "number" ? item.miqdor : 0,
          parchasi: typeof item.parchasi === "string" ? item.parchasi : "",
        }
        if (item.statistika !== "band" && item.statistika !== "faol" && item.statistika !== "ishsizlik" && item.statistika !== "tadbirkor") return []
        return acceptProposal(text, proposal) ? [proposal] : []
      })
    } catch {
      continue
    }
  }
  return []
}

export async function decisionText(raqam: string) {
  const decision = (await storedDecisions()).find((item) => item.raqam === raqam)
  if (!decision) return ""
  const tasks = (await storedTasks()).filter((item) => item.qaror === raqam)
  const document = await documentById(decision.hujjat)
  return [decision.nomi, ...tasks.map((item) => item.matn), document?.matn ?? ""].filter(Boolean).join("\n").slice(0, 80000)
}

export async function recordImpacts(raqam: string, text: string, holat: "taklif" | "tasdiqlangan") {
  const local = proposalsFromText(text)
  let chosen = local
  if (!isSecretText(text)) {
    const remote = await askImpacts(text)
    if (remote.length) {
      const ids = new Set(remote.map((item) => item.statistika))
      chosen = [...remote, ...local.filter((item) => !ids.has(item.statistika))]
    }
  }
  await saveImpacts(raqam, chosen, holat)
  return chosen
}
