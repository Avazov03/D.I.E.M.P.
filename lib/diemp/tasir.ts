import { documentById, listImpacts, saveImpacts, storedDecisions, storedTasks } from "@/lib/diemp/db"
import { isSecretText } from "@/lib/diemp/read-file"
import { statistics } from "@/lib/diemp/stat-catalog"
import { acceptProposal, effectiveAmount, proposalsFromText, type Proposal } from "@/lib/diemp/stat-math"

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
- "ming" yozilgan sonni mingga ko'paytir: 40 ming ta = 40000, 250 ming kishi = 250000. Foiz punktini ko'paytirma.
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
          miqdor: effectiveAmount(
            item.statistika === "faol" || item.statistika === "ishsizlik" || item.statistika === "tadbirkor" ? item.statistika : "band",
            typeof item.miqdor === "number" ? item.miqdor : 0,
            `${typeof item.parchasi === "string" ? item.parchasi : ""}\n${text}`,
          ),
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

function oneEach(rows: Proposal[]) {
  const chosen = new Map<string, Proposal>()
  for (const row of rows) {
    if (!chosen.has(row.statistika)) chosen.set(row.statistika, row)
  }
  return [...chosen.values()]
}

export async function recordImpacts(raqam: string, text: string, holat: "taklif" | "tasdiqlangan") {
  const local = oneEach(proposalsFromText(text))
  let chosen = local
  if (!isSecretText(text)) {
    const remote = oneEach(await askImpacts(text))
    chosen = [...local, ...remote.filter((item) => !local.some((row) => row.statistika === item.statistika))]
  }
  await saveImpacts(raqam, chosen, holat)
  return chosen
}

export async function repairImpacts() {
  const impacts = await listImpacts()
  const decisions = await storedDecisions()
  for (const decision of decisions) {
    const rows = impacts.filter((item) => item.qaror === decision.raqam && item.holat !== "rad")
    if (!rows.length) continue
    const text = await decisionText(decision.raqam)
    if (!text || isSecretText(text)) continue
    const local = oneEach(proposalsFromText(text))
    if (!local.length) continue
    const counts = new Map<string, number>()
    for (const row of rows) counts.set(row.statistika, (counts.get(row.statistika) ?? 0) + 1)
    const duplicate = [...counts.values()].some((count) => count > 1)
    const missing = local.some((item) => !counts.has(item.statistika))
    const wrong = local.some((item) => {
      const stored = rows.find((row) => row.statistika === item.statistika)
      return stored ? Math.abs(stored.miqdor - item.miqdor) > 0.001 : false
    })
    if (!duplicate && !missing && !wrong) continue
    const holat = rows.some((row) => row.holat === "tasdiqlangan") ? "tasdiqlangan" : "taklif"
    await saveImpacts(decision.raqam, local, holat)
  }
}
