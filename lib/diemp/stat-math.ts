import { statisticById, statistics, type StatId, type Statistic } from "@/lib/diemp/stat-catalog"

export type ImpactInput = {
  id: string
  qaror: string
  statistika: string
  belgi: "+" | "-"
  miqdor: number
  parchasi: string
  holat: "taklif" | "tasdiqlangan" | "rad"
}

export type Proposal = {
  statistika: StatId
  belgi: "+" | "-"
  miqdor: number
  parchasi: string
}

const rules: { id: StatId; keys: RegExp; quoted: RegExp }[] = [
  { id: "ishsizlik", keys: /ishsizlik/, quoted: /ming/ },
  { id: "tadbirkor", keys: /tadbirkor|korxona|yuridik shaxs|subyekt/, quoted: /ming kishi|foiz/ },
  { id: "faol", keys: /iqtisodiy faol/, quoted: /foiz/ },
  { id: "band", keys: /ishchi norma|ish o['’`]?rn|shtat birlik|shtat|bandlik|xodim|ish bilan band/, quoted: /foiz/ },
]

function fold(value: string) {
  return value.toLowerCase().replace(/ʻ|’|`/g, "'").replace(/\s+/g, " ").trim()
}

function group(value: number, digits: number) {
  const negative = value < 0
  const [whole, fraction = ""] = Math.abs(value).toFixed(digits).split(".")
  const body = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  const text = digits > 0 ? `${body},${fraction}` : body
  return negative ? `-${text}` : text
}

export function baselineOf(stat: Statistic) {
  return stat.qator[stat.qator.length - 1]?.qiymat ?? 0
}

export function signedAmount(belgi: "+" | "-", miqdor: number) {
  return belgi === "-" ? -Math.abs(miqdor) : Math.abs(miqdor)
}

export function effectiveAmount(statId: string, miqdor: number, text: string) {
  if (statId === "ishsizlik" || !(miqdor > 0) || miqdor >= 2000) return miqdor
  const source = fold(text)
  const sentences = source.split(/[.\n;]+/).filter((sentence) => numberInText(sentence, miqdor))
  if (sentences.some((sentence) => /ming/.test(sentence))) return Math.round(miqdor * 1000)
  return miqdor
}

function amountOf(item: ImpactInput) {
  return effectiveAmount(item.statistika, item.miqdor, item.parchasi)
}

export function confirmedShift(stat: Statistic, impacts: ImpactInput[]) {
  return impacts
    .filter((item) => item.statistika === stat.id && item.holat === "tasdiqlangan")
    .reduce((sum, item) => sum + signedAmount(item.belgi, amountOf(item)) * stat.impactScale, 0)
}

export function currentOf(stat: Statistic, impacts: ImpactInput[]) {
  return baselineOf(stat) + confirmedShift(stat, impacts)
}

export function formatImpact(stat: Statistic, miqdor: number) {
  const digits = stat.id === "ishsizlik" ? 1 : 0
  return `${group(Math.abs(miqdor), digits)} ${stat.impactBirlik}`
}

export function formatSeriesValue(statId: string, value: number) {
  if (statId === "band" || statId === "faol") return `${group(Math.round(value * 1000), 0)} kishi`
  if (statId === "ishsizlik") return `${group(value, 1)}%`
  return `${group(Math.round(value), 0)} ta`
}

export function formatSeriesDelta(statId: string, delta: number) {
  const quiet = statId === "ishsizlik" ? 0.05 : 0.5
  if (Math.abs(delta) < quiet) return "o'zgarish yo'q"
  const sign = delta > 0 ? "+" : "−"
  return `${sign}${formatSeriesValue(statId, Math.abs(delta))}`
}

function formatBaseline(stat: Statistic) {
  return formatSeriesValue(stat.id, baselineOf(stat))
}

export function formatCurrent(stat: Statistic, impacts: ImpactInput[]) {
  return formatSeriesValue(stat.id, currentOf(stat, impacts))
}

function sumText(stat: Statistic, impacts: ImpactInput[], holat: ImpactInput["holat"]) {
  const rows = impacts.filter((item) => item.statistika === stat.id && item.holat === holat)
  if (!rows.length) return ""
  const sum = rows.reduce((total, item) => total + signedAmount(item.belgi, amountOf(item)), 0)
  if (!sum) return ""
  const sign = sum > 0 ? "+" : "−"
  return `${sign}${formatImpact(stat, sum)}`
}

export function boardCards(impacts: ImpactInput[]) {
  return statistics.map((stat) => ({
    id: stat.id,
    nomi: stat.nomi,
    manba: stat.manba,
    havola: stat.havola,
    yil: stat.yil,
    chartBirlik: stat.chartBirlik,
    qator: [
      ...stat.qator.map((point) => ({ yil: String(point.yil), qiymat: point.qiymat })),
      ...(confirmedShift(stat, impacts) === 0 ? [] : [{ yil: "Hozir", qiymat: stat.id === "ishsizlik" ? Math.round(currentOf(stat, impacts) * 10) / 10 : currentOf(stat, impacts) }]),
    ],
    joriy: formatCurrent(stat, impacts),
    oldin: formatBaseline(stat),
    tasdiq: sumText(stat, impacts, "tasdiqlangan") || "Tasdiqlangan ta'sir yo'q",
    taklif: sumText(stat, impacts, "taklif"),
  }))
}

export type DecisionView = {
  raqam: string
  nomi: string
  sana: string
  tasirlar: {
    id: string
    nomi: string
    belgi: "+" | "-"
    matn: string
    parchasi: string
    holat: ImpactInput["holat"]
    miqdor: number
  }[]
}

export function decisionViews(
  decisions: { raqam: string; nomi: string; sana: string }[],
  impacts: ImpactInput[],
): DecisionView[] {
  return decisions.map((decision) => ({
    raqam: decision.raqam,
    nomi: decision.nomi,
    sana: decision.sana || "—",
    tasirlar: impacts
      .filter((item) => item.qaror === decision.raqam && item.holat !== "rad")
      .map((item) => {
        const stat = statisticById(item.statistika)
        const miqdor = amountOf(item)
        return {
          id: item.id,
          nomi: stat?.nomi || item.statistika,
          belgi: item.belgi,
          matn: stat ? `${item.belgi}${formatImpact(stat, miqdor)}` : String(miqdor),
          parchasi: item.parchasi,
          holat: item.holat,
          miqdor: signedAmount(item.belgi, miqdor),
        }
      }),
  }))
}

function numberInText(text: string, value: number) {
  const plain = Number.isInteger(value) ? String(value) : String(value).replace(".", "[.,]")
  const pattern = new RegExp(`(?<!\\d)${plain}(?!\\d)`)
  return pattern.test(text)
}

function sentenceSign(sentence: string): "+" | "-" | null {
  if (/qisqar|kamay|tugat|bekor|yopil|qisqartir|chiqarib|kamaytir/.test(sentence)) return "-"
  if (/tashkil|ko'pay|yangi|ochil|qo'sh|yarat|kirit|joriy/.test(sentence)) return "+"
  return null
}

function readNumber(raw: string) {
  const normalized = raw.replace(/\s/g, "").replace(",", ".")
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

export function proposalsFromText(text: string): Proposal[] {
  const found: Proposal[] = []
  const sentences = text.split(/[.\n;]+/).map((item) => fold(item)).filter(Boolean)
  for (const sentence of sentences) {
    const rule = rules.find((item) => item.keys.test(sentence))
    if (!rule) continue
    if (rule.id === "ishsizlik" && !/foiz|punkt|%/.test(sentence)) continue
    const stat = statisticById(rule.id)
    if (!stat) continue
    const sign = sentenceSign(sentence)
    if (!sign) continue
    const numbers = [...sentence.matchAll(/(\d[\d\s]*[.,]?\d*)/g)]
      .map((match) => ({ raw: match[1], value: readNumber(match[1]), index: match.index ?? 0 }))
      .filter((item): item is { raw: string; value: number; index: number } => item.value !== null && item.value > 0)
    const keyIndex = sentence.search(rule.keys)
    numbers.sort((a, b) => Math.abs(a.index - keyIndex) - Math.abs(b.index - keyIndex))
    const pick = numbers.find((item) => {
      if (rule.id === "ishsizlik") return item.value > 0 && item.value <= 5 && Math.abs(item.value - baselineOf(stat)) > 0.05
      const quoted = /ming/.test(sentence) ? item.value : item.value * stat.impactScale
      if (baselineOf(stat) > 0 && Math.abs(quoted - baselineOf(stat)) / baselineOf(stat) < 0.02) return false
      const amount = /ming/.test(sentence) && item.value < 2000 ? item.value * 1000 : item.value
      if ((rule.id === "band" || rule.id === "faol") && amount > 2000000) return false
      if (rule.id === "tadbirkor" && amount > 500000) return false
      return numberInText(sentence, item.value)
    })
    if (!pick) continue
    let miqdor = pick.value
    if (rule.id !== "ishsizlik" && /ming/.test(sentence) && miqdor < 2000) miqdor = Math.round(miqdor * 1000)
    if (found.some((item) => item.statistika === rule.id)) continue
    const at = sentence.indexOf(pick.raw.trim())
    const from = Math.max(0, at - 30)
    found.push({ statistika: rule.id, belgi: sign, miqdor, parchasi: sentence.slice(from, from + 160) })
  }
  return found
}

export function acceptProposal(text: string, proposal: Proposal) {
  const stat = statisticById(proposal.statistika)
  if (!stat) return false
  if (!(proposal.belgi === "+" || proposal.belgi === "-")) return false
  if (!Number.isFinite(proposal.miqdor) || proposal.miqdor <= 0) return false
  if (proposal.statistika === "ishsizlik" && proposal.miqdor > 5) return false
  if ((proposal.statistika === "band" || proposal.statistika === "faol") && proposal.miqdor > 2000000) return false
  if (proposal.statistika === "tadbirkor" && proposal.miqdor > 500000) return false
  const source = fold(text)
  const stated = numberInText(source, proposal.miqdor) || (proposal.miqdor >= 1000 && proposal.miqdor % 1000 === 0 && /ming/.test(source) && numberInText(source, proposal.miqdor / 1000))
  if (!stated) return false
  const snippet = fold(proposal.parchasi)
  return snippet.length > 8 && source.includes(snippet)
}
