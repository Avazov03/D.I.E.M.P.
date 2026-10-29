export type StatId =
  | "band"
  | "faol"
  | "ishsizlik"
  | "tadbirkor"
  | "yaim"
  | "sanoat"
  | "qishloq"
  | "invest"
  | "qurilish"
  | "yuk"
  | "yolovchi"
  | "chakana"
  | "xizmat"
  | "aholi"

export type Statistic = {
  id: StatId
  nomi: string
  manba: string
  havola: string
  yil: number
  qator: { yil: number | string; qiymat: number }[]
  impactScale: number
  impactBirlik: string
  chartBirlik: string
  eLon?: number
  davr?: string
}

const band = [11628.4, 11919.1, 12223.8, 12523.3, 12818.4, 13058.3, 13298.4, 13520.3, 13273.1, 13541.1, 13236.4, 13538.9, 13706.2, 14014.2, 14261.9, 14933.9]
const faol = [12286.6, 12541.5, 12850.1, 13163, 13505.4, 13767.7, 14022.4, 14357.3, 14641.7, 14876.4, 14797.4, 14980.7, 15038.9, 15038.3, 15097.9, 15678.8]
const ishsizlik = [5.4, 5, 4.9, 4.9, 5.1, 5.2, 5.2, 5.8, 9.3, 9, 10.5, 9.6, 8.9, 6.8, 5.5, 4.8]
const tadbirkor = [213111, 231989, 265016, 337096, 414186, 465889, 527222, 420772, 361793, 407850]

function years(start: number, values: number[]) {
  return values.map((qiymat, index) => ({ yil: start + index, qiymat }))
}

export const statistics: Statistic[] = [
  {
    id: "band",
    nomi: "Ish bilan band aholi",
    manba: "Stat.uz, iqtisodiyotda bandlar soni, 2025",
    havola: "https://siat.stat.uz/data/567/",
    yil: 2025,
    qator: years(2010, band),
    impactScale: 0.001,
    impactBirlik: "kishi",
    chartBirlik: "ming kishi",
  },
  {
    id: "faol",
    nomi: "Iqtisodiy faol aholi",
    manba: "Stat.uz, iqtisodiy faol aholi soni, 2025",
    havola: "https://siat.stat.uz/data/554/",
    yil: 2025,
    qator: years(2010, faol),
    impactScale: 0.001,
    impactBirlik: "kishi",
    chartBirlik: "ming kishi",
  },
  {
    id: "ishsizlik",
    nomi: "Ishsizlik darajasi",
    manba: "Stat.uz, ishsizlik darajasi, 2025",
    havola: "https://siat.stat.uz/data/1875/",
    yil: 2025,
    qator: years(2010, ishsizlik),
    impactScale: 1,
    impactBirlik: "foiz punkti",
    chartBirlik: "foiz",
  },
  {
    id: "tadbirkor",
    nomi: "Tadbirkorlik subyektlari",
    manba: "Stat.uz, faoliyat ko'rsatayotgan tadbirkorlik subyektlari, 2026",
    havola: "https://siat.stat.uz/data/2044/",
    yil: 2026,
    qator: years(2017, tadbirkor),
    impactScale: 1,
    impactBirlik: "ta",
    chartBirlik: "ta",
  },
]

let liveStats: Statistic[] = []

export function registerLive(rows: Statistic[]) {
  liveStats = rows
}

export function allStatistics() {
  return [...statistics, ...liveStats]
}

export function statisticById(id: string) {
  return liveStats.find((item) => item.id === id) ?? statistics.find((item) => item.id === id) ?? null
}

export function isIndexStat(id: string) {
  return id === "yaim" || id === "sanoat" || id === "qishloq" || id === "invest" || id === "qurilish" || id === "yuk" || id === "yolovchi" || id === "chakana" || id === "xizmat"
}
