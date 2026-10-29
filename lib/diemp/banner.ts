import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { dataDir } from "@/lib/diemp/db"
import { registerLive, type StatId, type Statistic } from "@/lib/diemp/stat-catalog"

type BannerItem = { id: StatId; value: number; davr: string }
type Point = { yil: string; qiymat: number }
type CacheFile = { at: number; banner: BannerItem[]; series: Partial<Record<StatId, Point[]>> }

const ttl = 6 * 60 * 60 * 1000
const page = "https://stat.uz/uz/"

const names: { id: StatId; nomi: string; test: RegExp; people?: boolean }[] = [
  { id: "yaim", nomi: "Yalpi ichki mahsulot", test: /yalpi ichki/i },
  { id: "sanoat", nomi: "Sanoat", test: /^sanoat$/i },
  { id: "qishloq", nomi: "Qishloq, o'rmon va baliq xo'jaligi", test: /qishloq/i },
  { id: "invest", nomi: "Asosiy kapitalga kiritilgan investitsiyalar", test: /investitsiya/i },
  { id: "qurilish", nomi: "Qurilish ishlari", test: /qurilish ish/i },
  { id: "yuk", nomi: "Yuk aylanmasi", test: /yuk aylanm/i },
  { id: "yolovchi", nomi: "Yo'lovchi aylanmasi", test: /yo.lovchi aylanm/i },
  { id: "chakana", nomi: "Chakana tovar aylanmasi", test: /chakana/i },
  { id: "xizmat", nomi: "Xizmatlar", test: /^xizmatlar$/i },
  { id: "aholi", nomi: "Doimiy aholi soni", test: /doimiy aholi/i, people: true },
]

const seriesOf: { id: StatId; code: string; row: RegExp; scale: number }[] = [
  { id: "yaim", code: "iqtisodiy-faoliyat-turlari-kesimida-yaim-osish-su", row: /^yaim$/i, scale: 1 },
  { id: "sanoat", code: "iqtisodiy-faoliyat-turi-boyicha-sanoat-ishlab-chi", row: /sanoat mahsuloti hajmi/i, scale: 1 },
  { id: "invest", code: "asosiy-kapitalga-ozlashtirilgan-investitsiyalar-1", row: /zbekiston respublikasi/i, scale: 1 },
  { id: "qurilish", code: "qurilish-ishlari-osish-surati-yillik", row: /zbekiston respublikasi/i, scale: 1 },
  { id: "chakana", code: "chakana-savdo-tovar-aylanmasi-hajmining-osish-sur", row: /chakana savdo aylanmasi/i, scale: 1 },
  { id: "xizmat", code: "hududlar-boyicha-korsatilgan-xizmatlar-hajmining", row: /zbekiston respublikasi/i, scale: 1 },
  { id: "aholi", code: "doimiy-aholi-soni", row: /^jami$|^total$/i, scale: 1000 },
]

function cachePath() {
  return path.join(dataDir(), "banner.json")
}

function parseNumber(raw: string) {
  const text = raw.replace(/\s/g, "")
  if (/^\d{1,3}(,\d{3})+$/.test(text)) return Number(text.replace(/,/g, ""))
  if (/^\d+,\d{1,2}$/.test(text)) return Number(text.replace(",", "."))
  const value = Number(text.replace(",", "."))
  return Number.isFinite(value) ? value : null
}

function parseBanner(html: string): BannerItem[] {
  const found: BannerItem[] = []
  const items = html.matchAll(/<h1>([^<]+)<\/h1>\s*<h2>([\d\s,.]+)/g)
  const notes = [...html.matchAll(/<p>([^<]+)<\/p>/g)].map((item) => item[1].replace(/\s+/g, " ").trim())
  let noteAt = 0
  for (const item of items) {
    const title = item[1].replace(/`/g, "'").replace(/\s+/g, " ").trim()
    const spec = names.find((row) => row.test.test(title))
    const value = parseNumber(item[2])
    const davr = notes[noteAt] || ""
    noteAt += 1
    if (!spec || value === null || found.some((row) => row.id === spec.id)) continue
    found.push({ id: spec.id, value, davr })
  }
  return found
}

function rowText(row: Record<string, unknown>) {
  return Object.entries(row)
    .filter(([key]) => !/^\d{4}/.test(key))
    .map(([, value]) => String(value).replace(/[`ʻ’]/g, "'").trim())
}

function seriesPoints(body: { data?: Record<string, unknown>[] }, rowTest: RegExp, scale: number): Point[] {
  const row = (body.data || []).find((item) => rowText(item).some((text) => rowTest.test(text)))
  if (!row) return []
  const points = Object.entries(row)
    .filter(([key]) => /^\d{4}/.test(key))
    .map(([yil, value]) => ({ yil: yil.replace(/\*$/, ""), qiymat: Number(String(value).replace(/\s/g, "").replace(",", ".")) * scale }))
    .filter((point) => Number.isFinite(point.qiymat) && point.qiymat !== 0)
    .sort((a, b) => a.yil.localeCompare(b.yil))
  if (scale === 1) {
    const mid = points[Math.floor(points.length / 2)]?.qiymat ?? 0
    if (points.length < 4 || mid < 40 || mid > 300) return []
  }
  return points
}

async function readCache(): Promise<CacheFile | null> {
  try {
    const parsed = JSON.parse(await readFile(cachePath(), "utf8")) as CacheFile
    if (!Array.isArray(parsed.banner) || !parsed.series) return null
    return parsed
  } catch {
    return null
  }
}

async function writeCache(file: CacheFile) {
  await mkdir(dataDir(), { recursive: true })
  await writeFile(cachePath(), JSON.stringify(file))
}

function toStats(banner: BannerItem[], series: Partial<Record<StatId, Point[]>>, savedAt: number): Statistic[] {
  const saved = new Date(savedAt).toLocaleString("uz-UZ", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
  return names.flatMap((spec) => {
    const item = banner.find((row) => row.id === spec.id)
    const qator = series[spec.id] || []
    if (!item && !qator.length) return []
    const latest = qator[qator.length - 1]
    const year = Number(String(latest?.yil).slice(0, 4)) || new Date().getFullYear()
    const davr = spec.people
      ? `${item?.davr || `Ochiq qator ${latest?.yil || ""}`}. Chiziq ochiq qator, ${qator[0]?.yil || ""}–${latest?.yil || ""}. Yangilangan: ${saved}.`
      : `${item?.davr || "Stat.uz joriy e'lon"}. Yangilangan: ${saved}.`
    return [{
      id: spec.id,
      nomi: spec.nomi,
      manba: "Stat.uz, O'zbekiston raqamlarda",
      havola: page,
      yil: year,
      qator,
      impactScale: 1,
      impactBirlik: spec.people ? "kishi" : "foiz punkti",
      chartBirlik: spec.people ? "kishi" : "foiz",
      eLon: item?.value,
      davr,
    } satisfies Statistic]
  })
}

let memory: { at: number; rows: Statistic[] } | null = null
let pending: Promise<Statistic[]> | null = null

async function loadFresh(): Promise<Statistic[]> {
  const cached = await readCache()
  if (cached && Date.now() - cached.at < ttl) {
    const rows = toStats(cached.banner, cached.series, cached.at)
    registerLive(rows)
    memory = { at: cached.at, rows }
    return rows
  }
  const next: CacheFile = cached || { at: 0, banner: [], series: {} }
  try {
    const response = await fetch(page, { headers: { "User-Agent": "D.I.E.M.P." }, signal: AbortSignal.timeout(8000) })
    if (response.ok) {
      const html = await response.text()
      const start = html.indexOf("indicator-item")
      const banner = parseBanner(start >= 0 ? html.slice(start, start + 16000) : html)
      if (banner.length >= 8) next.banner = banner
    }
  } catch {
    // Oxirgi saqlangan e'lon qoladi.
  }
  await Promise.all(seriesOf.map(async (spec) => {
    try {
      const response = await fetch(`https://api.stat.uz/api/v1.0/data/${spec.code}?lang=uz&format=json`, { signal: AbortSignal.timeout(8000) })
      if (!response.ok) return
      const points = seriesPoints(await response.json(), spec.row, spec.scale)
      if (points.length) next.series[spec.id] = points
    } catch {
      // Shu qatorning eski nusxasi qoladi.
    }
  }))
  if (!next.banner.length) {
    const rows = cached ? toStats(cached.banner, cached.series, cached.at) : []
    registerLive(rows)
    memory = { at: Date.now(), rows }
    return rows
  }
  next.at = Date.now()
  await writeCache(next).catch(() => undefined)
  const rows = toStats(next.banner, next.series, next.at)
  registerLive(rows)
  memory = { at: next.at, rows }
  return rows
}

export function loadLiveStats() {
  if (memory && Date.now() - memory.at < ttl) return Promise.resolve(memory.rows)
  if (!pending) pending = loadFresh().finally(() => { pending = null })
  return pending
}
