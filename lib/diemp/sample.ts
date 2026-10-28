import { statusLabel } from "@/lib/diemp/labels"

export type DataRow = Record<string, string>

export type Column = {
  key: string
  label: string
  kind?: "status" | "text"
}

export type FilterDef = {
  param: string
  label: string
  options: { value: string; label: string }[]
}

export const organizations = [
  { kod: "iqtisod", nom: "Iqtisodiyot vazirligi" },
  { kod: "qurilish", nom: "Qurilish vazirligi" },
  { kod: "sogliq", nom: "Sog'liqni saqlash vazirligi" },
  { kod: "transport", nom: "Transport vazirligi" },
  { kod: "raqamli", nom: "Raqamli texnologiyalar vazirligi" },
] as const

export const decisions: DataRow[] = [
  { raqam: "NM-01", turi: "qaror", nomi: "Namuna: hududiy obektlar dasturi", sana: "12.01.2026", maxfiylik: "ichki", holat: "ijroda", topshiriq: "4" },
  { raqam: "NM-02", turi: "farmoyish", nomi: "Namuna: tibbiyot uskunasini yangilash", sana: "03.02.2026", maxfiylik: "ichki", holat: "ijroda", topshiriq: "3" },
  { raqam: "NM-03", turi: "qaror", nomi: "Namuna: transport yo'laklari", sana: "18.02.2026", maxfiylik: "ichki", holat: "muddati_otgan", topshiriq: "3" },
  { raqam: "NM-04", turi: "bayon", nomi: "Namuna: raqamli xizmatlar", sana: "09.03.2026", maxfiylik: "ichki", holat: "yakunlangan", topshiriq: "3" },
  { raqam: "NM-05", turi: "qaror", nomi: "Namuna: maxfiy ilova (ko'rinish cheklangan)", sana: "21.03.2026", maxfiylik: "maxfiy", holat: "ijroda", topshiriq: "3" },
]

export const tasks: DataRow[] = [
  { raqam: "NM-01-01", qaror: "NM-01", matn: "12 ta obekt bo'yicha ish hajmini topshirish", tashkilot: "iqtisod", muddat: "30.06.2026", holat: "yakunlangan", muddatKod: "rioya", xatar: "past", oy: "Mar", jismoniy: "100", jismoniyTasdiq: "ha", moliyaviy: "91", moliyaviyTasdiq: "ha" },
  { raqam: "NM-01-02", qaror: "NM-01", matn: "Moliyalashtirish jadvalini kelishish", tashkilot: "iqtisod", muddat: "15.08.2026", holat: "ijroda", muddatKod: "yaqin", xatar: "orta", oy: "Sen", jismoniy: "62", jismoniyTasdiq: "ha", moliyaviy: "81", moliyaviyTasdiq: "ha" },
  { raqam: "NM-01-03", qaror: "NM-01", matn: "Oraliq bosqich dalillarini yig'ish", tashkilot: "qurilish", muddat: "01.05.2026", holat: "muddati_otgan", muddatKod: "otgan", xatar: "yuqori", oy: "May", jismoniy: "28", jismoniyTasdiq: "ha", moliyaviy: "70", moliyaviyTasdiq: "ha" },
  { raqam: "NM-01-04", qaror: "NM-01", matn: "Yakuniy dalil to'plamini tekshirish", tashkilot: "qurilish", muddat: "20.10.2026", holat: "ijroda", muddatKod: "yaqin", xatar: "orta", oy: "Okt", jismoniy: "40", jismoniyTasdiq: "yoq", moliyaviy: "35", moliyaviyTasdiq: "yoq" },
  { raqam: "NM-02-01", qaror: "NM-02", matn: "48 ta uskuna yetkazib berilganini tasdiqlash", tashkilot: "sogliq", muddat: "12.04.2026", holat: "yakunlangan", muddatKod: "rioya", xatar: "past", oy: "Apr", jismoniy: "100", jismoniyTasdiq: "ha", moliyaviy: "96", moliyaviyTasdiq: "ha" },
  { raqam: "NM-02-02", qaror: "NM-02", matn: "Xodimlarni o'qitish bosqichi", tashkilot: "sogliq", muddat: "30.09.2026", holat: "ijroda", muddatKod: "yaqin", xatar: "past", oy: "Sen", jismoniy: "54", jismoniyTasdiq: "ha", moliyaviy: "40", moliyaviyTasdiq: "ha" },
  { raqam: "NM-02-03", qaror: "NM-02", matn: "Nosoz uskunalar bo'yicha qayta hisobot", tashkilot: "sogliq", muddat: "02.07.2026", holat: "muddati_otgan", muddatKod: "otgan", xatar: "yuqori", oy: "Iyl", jismoniy: "15", jismoniyTasdiq: "ha", moliyaviy: "60", moliyaviyTasdiq: "ha" },
  { raqam: "NM-03-01", qaror: "NM-03", matn: "3 ta yo'lak bo'yicha qurilish hajmi", tashkilot: "transport", muddat: "18.03.2026", holat: "muddati_otgan", muddatKod: "otgan", xatar: "yuqori", oy: "Mar", jismoniy: "22", jismoniyTasdiq: "ha", moliyaviy: "77", moliyaviyTasdiq: "ha" },
  { raqam: "NM-03-02", qaror: "NM-03", matn: "Bekatlar bo'yicha oraliq nazorat", tashkilot: "transport", muddat: "11.08.2026", holat: "ijroda", muddatKod: "yaqin", xatar: "orta", oy: "Avg", jismoniy: "47", jismoniyTasdiq: "ha", moliyaviy: "52", moliyaviyTasdiq: "ha" },
  { raqam: "NM-03-03", qaror: "NM-03", matn: "Yo'l qoplamasi bo'yicha yakuniy dalil", tashkilot: "qurilish", muddat: "05.02.2026", holat: "yakunlangan", muddatKod: "rioya", xatar: "past", oy: "Fev", jismoniy: "100", jismoniyTasdiq: "ha", moliyaviy: "88", moliyaviyTasdiq: "ha" },
  { raqam: "NM-04-01", qaror: "NM-04", matn: "Portal xizmatini ishga tushirish", tashkilot: "raqamli", muddat: "28.01.2026", holat: "yakunlangan", muddatKod: "rioya", xatar: "yoq", oy: "Yan", jismoniy: "100", jismoniyTasdiq: "ha", moliyaviy: "100", moliyaviyTasdiq: "ha" },
  { raqam: "NM-04-02", qaror: "NM-04", matn: "Idoralararo ma'lumot almashinuvi", tashkilot: "raqamli", muddat: "16.05.2026", holat: "yakunlangan", muddatKod: "rioya", xatar: "past", oy: "May", jismoniy: "100", jismoniyTasdiq: "ha", moliyaviy: "73", moliyaviyTasdiq: "ha" },
  { raqam: "NM-04-03", qaror: "NM-04", matn: "Foydalanuvchi yo'riqnomasini tasdiqlash", tashkilot: "raqamli", muddat: "09.09.2026", holat: "ijroda", muddatKod: "rioya", xatar: "past", oy: "Sen", jismoniy: "80", jismoniyTasdiq: "ha", moliyaviy: "20", moliyaviyTasdiq: "ha" },
  { raqam: "NM-05-01", qaror: "NM-05", matn: "Maxfiy ilova bandi — cheklangan ko'rinish", tashkilot: "iqtisod", muddat: "01.10.2026", holat: "ijroda", muddatKod: "yaqin", xatar: "orta", oy: "Okt", jismoniy: "10", jismoniyTasdiq: "yoq", moliyaviy: "0", moliyaviyTasdiq: "yoq", maxfiylik: "maxfiy" },
  { raqam: "NM-05-02", qaror: "NM-05", matn: "Maxfiy ilova muddati o'tgan band", tashkilot: "transport", muddat: "14.04.2026", holat: "muddati_otgan", muddatKod: "otgan", xatar: "yuqori", oy: "Apr", jismoniy: "5", jismoniyTasdiq: "yoq", moliyaviy: "12", moliyaviyTasdiq: "yoq", maxfiylik: "maxfiy" },
  { raqam: "NM-05-03", qaror: "NM-05", matn: "Maxfiy ilova yopilgan band", tashkilot: "raqamli", muddat: "22.08.2026", holat: "yakunlangan", muddatKod: "rioya", xatar: "past", oy: "Avg", jismoniy: "100", jismoniyTasdiq: "ha", moliyaviy: "100", moliyaviyTasdiq: "ha", maxfiylik: "maxfiy" },
]

export const reports: DataRow[] = [
  { raqam: "HS-101", topshiriq: "NM-01-02", davr: "2026-III", tashkilot: "iqtisod", holat: "kutilmoqda", hajm: "62 / 100", muammo: "Yetkazib berish kechikkan" },
  { raqam: "HS-102", topshiriq: "NM-01-03", davr: "2026-II", tashkilot: "qurilish", holat: "qaytarilgan", hajm: "28 / 80", muammo: "Dalil topshiriq bandiga mos emas" },
  { raqam: "HS-103", topshiriq: "NM-02-01", davr: "2026-I", tashkilot: "sogliq", holat: "tasdiqlangan", hajm: "48 / 48", muammo: "—" },
  { raqam: "HS-104", topshiriq: "NM-02-03", davr: "2026-II", tashkilot: "sogliq", holat: "kutilmoqda", hajm: "6 / 40", muammo: "Nosozlik sababi yozilmagan" },
  { raqam: "HS-105", topshiriq: "NM-03-01", davr: "2026-I", tashkilot: "transport", holat: "tasdiqlangan", hajm: "1 / 3", muammo: "Qurilish hajmi rejadan ortda" },
  { raqam: "HS-106", topshiriq: "NM-03-02", davr: "2026-III", tashkilot: "transport", holat: "kutilmoqda", hajm: "2 / 4", muammo: "Oraliq dalil yuklanmagan" },
  { raqam: "HS-107", topshiriq: "NM-04-01", davr: "2026-I", tashkilot: "raqamli", holat: "tasdiqlangan", hajm: "1 / 1", muammo: "—" },
  { raqam: "HS-108", topshiriq: "NM-04-03", davr: "2026-III", tashkilot: "raqamli", holat: "tasdiqlangan", hajm: "4 / 5", muammo: "—" },
]

export const evidence: DataRow[] = [
  { raqam: "DL-01", topshiriq: "NM-02-01", tur: "PDF", holat: "tasdiqlangan", sana: "12.04.2026", xesh: "a91c…e4", maxfiylik: "ichki" },
  { raqam: "DL-02", topshiriq: "NM-01-03", tur: "DOCX", holat: "yetishmaydi", sana: "—", xesh: "—", maxfiylik: "ichki" },
  { raqam: "DL-03", topshiriq: "NM-03-01", tur: "XLSX", holat: "tasdiqlangan", sana: "20.03.2026", xesh: "11ab…90", maxfiylik: "ichki" },
  { raqam: "DL-04", topshiriq: "NM-03-02", tur: "PDF", holat: "tekshiruvda", sana: "02.08.2026", xesh: "77cd…12", maxfiylik: "ichki" },
  { raqam: "DL-05", topshiriq: "NM-04-01", tur: "PDF", holat: "tasdiqlangan", sana: "28.01.2026", xesh: "b310…aa", maxfiylik: "ichki" },
  { raqam: "DL-06", topshiriq: "NM-02-03", tur: "PDF", holat: "yetishmaydi", sana: "—", xesh: "—", maxfiylik: "ichki" },
  { raqam: "DL-07", topshiriq: "NM-01-01", tur: "PDF", holat: "tasdiqlangan", sana: "18.03.2026", xesh: "c882…41", maxfiylik: "ichki" },
  { raqam: "DL-08", topshiriq: "NM-04-02", tur: "CSV", holat: "tasdiqlangan", sana: "16.05.2026", xesh: "90ef…33", maxfiylik: "ichki" },
  { raqam: "DL-09", topshiriq: "NM-05-02", tur: "PDF", holat: "tekshiruvda", sana: "14.04.2026", xesh: "yashirin", maxfiylik: "maxfiy" },
]

export const kpis: DataRow[] = [
  { nom: "Obektlar soni", tur: "osish", olchov: "ta", reja: "100", tasdiq: "62", formula: "tasdiqlangan hajm / reja × 100", natija: "62%", holat: "tasdiqlangan", manba: "HS-101" },
  { nom: "Uskuna nosozligi", tur: "kamayish", olchov: "ta", reja: "10", tasdiq: "16", formula: "maqsadga yaqinlashuv, tasdiqlangan formula", natija: "Ortda", holat: "tasdiqlangan", manba: "HS-104" },
  { nom: "Yo'laklar", tur: "bosqich", olchov: "bosqich", reja: "100%", tasdiq: "22%", formula: "bosqich vazni × tasdiqlangan progress", natija: "22%", holat: "tasdiqlangan", manba: "HS-105" },
  { nom: "Portal ishga tushgan", tur: "bosqich", olchov: "ha/yo'q", reja: "Ha", tasdiq: "Ha", formula: "yakuniy shart tasdiqlangan", natija: "Ha", holat: "tasdiqlangan", manba: "HS-107" },
  { nom: "Tasdiqlanmagan ko'rsatkich", tur: "osish", olchov: "ta", reja: "50", tasdiq: "—", formula: "formula tasdiqlanmagan", natija: "Hisoblanmaydi", holat: "hisoblanmaydi", manba: "—" },
  { nom: "Nol reja", tur: "oraliq", olchov: "%", reja: "0", tasdiq: "4", formula: "reja 0 bo'lsa hisoblanmaydi", natija: "Hisoblanmaydi", holat: "hisoblanmaydi", manba: "NM-04-03" },
]

export const risks: DataRow[] = [
  { topshiriq: "NM-01-03", tur: "Qoida: muddat o'tgan", daraja: "yuqori", sabab: "Yakuniy muddat 01.05.2026, tasdiqlangan progress 28%", manba: "Topshiriq muddati, HS-102", tavsiya: "Dalilni qayta topshirish" },
  { topshiriq: "NM-02-03", tur: "Qoida: dalil yetishmaydi", daraja: "yuqori", sabab: "Majburiy dalil yo'q, hisobot tasdiq kutmoqda", manba: "DL-06, HS-104", tavsiya: "Dalil va sababni so'rash" },
  { topshiriq: "NM-03-01", tur: "Qoida: reja-fakt tafovuti", daraja: "yuqori", sabab: "Jismoniy 22%, moliyaviy 77%. Bu bir xil ko'rsatkich emas", manba: "HS-105, DL-03", tavsiya: "Jismoniy hajmni alohida tekshirish" },
  { topshiriq: "NM-03-02", tur: "Qoida: hisobot yo'q", daraja: "orta", sabab: "Muddat yaqin, hisobot hali tasdiqlanmagan", manba: "HS-106", tavsiya: "Hisobotni tekshirish navbatiga qo'yish" },
  { topshiriq: "NM-01-02", tur: "Qoida: progress sekin", daraja: "orta", sabab: "Tasdiqlangan hajm 62%, moliyaviy ijro 81%", manba: "HS-101", tavsiya: "Keyingi davr rejasini so'rash" },
  { topshiriq: "NM-05-02", tur: "Qoida: muddat o'tgan", daraja: "yuqori", sabab: "Maxfiy hujjat bandi. Tafsilot vakolat bilan ochiladi", manba: "NM-05", tavsiya: "Vakolatli ko'rik", maxfiylik: "maxfiy" },
]

export const events: DataRow[] = [
  { vaqt: "28.10.2026 09:40", hodisa: "Hisobot qaytarildi", obyekt: "HS-102", holat: "qaytarilgan", izoh: "Dalil topshiriq bandiga mos emas", href: "/hisobotlar?holat=qaytarilgan" },
  { vaqt: "28.10.2026 09:10", hodisa: "Muddat buzilishi qayd etildi", obyekt: "NM-03-01", holat: "muddati_otgan", izoh: "Qoidaviy xatar: yuqori", href: "/xatarlar?daraja=yuqori" },
  { vaqt: "27.10.2026 16:20", hodisa: "Hisobot tasdiq kutmoqda", obyekt: "HS-101", holat: "kutilmoqda", izoh: "Tasdiqlanmagan qiymat rasmiy foizga kirmaydi", href: "/hisobotlar?holat=kutilmoqda" },
  { vaqt: "27.10.2026 11:05", hodisa: "Dalil tasdiqlandi", obyekt: "DL-07", holat: "tasdiqlangan", izoh: "Xesh solishtirildi", href: "/dalillar?holat=tasdiqlangan" },
  { vaqt: "26.10.2026 15:44", hodisa: "Eksport rad etildi", obyekt: "NM-05", holat: "maxfiy", izoh: "Maxfiy yozuvni ruxsatsiz eksport qilib bo'lmaydi", href: "/audit" },
  { vaqt: "26.10.2026 10:12", hodisa: "KPI hisoblandi", obyekt: "Obektlar soni", holat: "tasdiqlangan", izoh: "62 / 100 = 62%. Moliyaviy ijro alohida", href: "/kpi" },
]

export const audit: DataRow[] = [
  { vaqt: "28.10.2026 09:41", aktor: "Nazorat mas'uli", amal: "Hisobotni qaytarish", obyekt: "HS-102", natija: "Qayd etildi" },
  { vaqt: "28.10.2026 09:11", aktor: "Tizim", amal: "Muddat qoidasini ishga tushirish", obyekt: "NM-03-01", natija: "Xatar ochildi" },
  { vaqt: "27.10.2026 16:22", aktor: "Ijrochi", amal: "Hisobot yuborish", obyekt: "HS-101", natija: "Tasdiq navbati" },
  { vaqt: "27.10.2026 11:06", aktor: "Nazorat mas'uli", amal: "Dalilni tasdiqlash", obyekt: "DL-07", natija: "Tasdiqlangan" },
  { vaqt: "26.10.2026 15:44", aktor: "Tahlilchi", amal: "Eksport", obyekt: "NM-05", natija: "Rad etildi" },
  { vaqt: "26.10.2026 10:12", aktor: "Tizim", amal: "KPI hisoblash", obyekt: "Obektlar soni", natija: "62%" },
  { vaqt: "25.10.2026 18:02", aktor: "Super administrator", amal: "Rol biriktirish", obyekt: "Namuna foydalanuvchi", natija: "Rahbariyat" },
]

export const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt"] as const

export function visibleTasks() {
  return tasks.filter((row) => row.maxfiylik !== "maxfiy")
}

export function countBy(rows: DataRow[], key: string, value: string) {
  return rows.filter((row) => row[key] === value).length
}

export function averageApproved(rows: DataRow[], valueKey: string, flagKey: string) {
  const values = rows
    .filter((row) => row[flagKey] === "ha")
    .map((row) => Number(row[valueKey]))
    .filter((value) => Number.isFinite(value))
  if (!values.length) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function deadlineRate(rows: DataRow[]) {
  const closed = rows.filter((row) => row.holat === "yakunlangan" || row.holat === "muddati_otgan")
  if (!closed.length) return null
  const onTime = closed.filter((row) => row.holat === "yakunlangan" && row.muddatKod === "rioya").length
  return Math.round((onTime / closed.length) * 100)
}

export function executionSeries(period: "10" | "3" | "1") {
  const slice = period === "1" ? months.slice(-1) : period === "3" ? months.slice(-3) : [...months]
  return slice.map((oy) => ({
    oy,
    yopilgan: tasks.filter((row) => row.oy === oy && row.holat === "yakunlangan" && row.maxfiylik !== "maxfiy").length,
    otgan: tasks.filter((row) => row.oy === oy && row.holat === "muddati_otgan" && row.maxfiylik !== "maxfiy").length,
  }))
}

export function organizationRows(): DataRow[] {
  return organizations.map((org) => {
    const orgTasks = visibleTasks().filter((row) => row.tashkilot === org.kod)
    const overdue = countBy(orgTasks, "holat", "muddati_otgan")
    const waiting = reports.filter((row) => row.tashkilot === org.kod && row.holat === "kutilmoqda").length
    const physical = averageApproved(orgTasks, "jismoniy", "jismoniyTasdiq")
    const financial = averageApproved(orgTasks, "moliyaviy", "moliyaviyTasdiq")
    return {
      tashkilot: org.kod,
      nom: org.nom,
      topshiriq: String(orgTasks.length),
      otgan: String(overdue),
      kutilmoqda: String(waiting),
      jismoniy: physical === null ? "—" : `${physical}%`,
      moliyaviy: financial === null ? "—" : `${financial}%`,
    }
  })
}

export const decisionColumns: Column[] = [
  { key: "raqam", label: "Hujjat" },
  { key: "turi", label: "Turi", kind: "status" },
  { key: "nomi", label: "Nomi" },
  { key: "sana", label: "Sana" },
  { key: "maxfiylik", label: "Maxfiylik", kind: "status" },
  { key: "holat", label: "Holat", kind: "status" },
  { key: "topshiriq", label: "Topshiriq" },
]

export const taskColumns: Column[] = [
  { key: "raqam", label: "Topshiriq" },
  { key: "qaror", label: "Qaror" },
  { key: "matn", label: "Matn" },
  { key: "tashkilot", label: "Tashkilot" },
  { key: "muddat", label: "Muddat" },
  { key: "holat", label: "Holat", kind: "status" },
  { key: "xatar", label: "Xatar", kind: "status" },
  { key: "jismoniy", label: "Jismoniy" },
  { key: "moliyaviy", label: "Moliyaviy" },
]

export const reportColumns: Column[] = [
  { key: "raqam", label: "Hisobot" },
  { key: "topshiriq", label: "Topshiriq" },
  { key: "davr", label: "Davr" },
  { key: "tashkilot", label: "Tashkilot" },
  { key: "holat", label: "Tekshiruv", kind: "status" },
  { key: "hajm", label: "Hajm" },
  { key: "muammo", label: "Muammo" },
]

export const evidenceColumns: Column[] = [
  { key: "raqam", label: "Dalil" },
  { key: "topshiriq", label: "Topshiriq" },
  { key: "tur", label: "Tur" },
  { key: "holat", label: "Tekshiruv", kind: "status" },
  { key: "sana", label: "Sana" },
  { key: "xesh", label: "Xesh" },
  { key: "maxfiylik", label: "Maxfiylik", kind: "status" },
]

export const kpiColumns: Column[] = [
  { key: "nom", label: "KPI" },
  { key: "tur", label: "Tur", kind: "status" },
  { key: "olchov", label: "O'lchov" },
  { key: "reja", label: "Reja" },
  { key: "tasdiq", label: "Tasdiqlangan" },
  { key: "formula", label: "Formula" },
  { key: "natija", label: "Natija" },
  { key: "holat", label: "Holat", kind: "status" },
  { key: "manba", label: "Manba" },
]

export const riskColumns: Column[] = [
  { key: "topshiriq", label: "Topshiriq" },
  { key: "tur", label: "Tur" },
  { key: "daraja", label: "Daraja", kind: "status" },
  { key: "sabab", label: "Sabab" },
  { key: "manba", label: "Manba" },
  { key: "tavsiya", label: "Keyingi qadam" },
]

export const auditColumns: Column[] = [
  { key: "vaqt", label: "Vaqt" },
  { key: "aktor", label: "Kim" },
  { key: "amal", label: "Amal" },
  { key: "obyekt", label: "Obyekt" },
  { key: "natija", label: "Natija" },
]

const orgOptions = organizations.map((org) => ({ value: org.kod, label: org.nom }))

export const decisionFilters: FilterDef[] = [
  { param: "turi", label: "Hujjat turi", options: [
    { value: "qaror", label: "Qaror" },
    { value: "farmoyish", label: "Farmoyish" },
    { value: "bayon", label: "Bayon" },
  ] },
  { param: "holat", label: "Holat", options: [
    { value: "ijroda", label: "Ijroda" },
    { value: "yakunlangan", label: "Yakunlangan" },
    { value: "muddati_otgan", label: "Muddati o'tgan" },
  ] },
  { param: "maxfiylik", label: "Maxfiylik", options: [
    { value: "ichki", label: "Ichki" },
    { value: "maxfiy", label: "Maxfiy" },
  ] },
]

export const taskFilters: FilterDef[] = [
  { param: "holat", label: "Holat", options: [
    { value: "ijroda", label: "Ijroda" },
    { value: "yakunlangan", label: "Yakunlangan" },
    { value: "muddati_otgan", label: "Muddati o'tgan" },
  ] },
  { param: "muddatKod", label: "Muddat", options: [
    { value: "otgan", label: "Muddati o'tgan" },
    { value: "yaqin", label: "Muddat yaqin" },
    { value: "rioya", label: "Muddatida" },
  ] },
  { param: "tashkilot", label: "Tashkilot", options: orgOptions },
  { param: "xatar", label: "Xatar", options: [
    { value: "yuqori", label: "Yuqori" },
    { value: "orta", label: "O'rta" },
    { value: "past", label: "Past" },
  ] },
]

export const reportFilters: FilterDef[] = [
  { param: "holat", label: "Tekshiruv", options: [
    { value: "kutilmoqda", label: "Tasdiq kutilmoqda" },
    { value: "qaytarilgan", label: "Qaytarilgan" },
    { value: "tasdiqlangan", label: "Tasdiqlangan" },
  ] },
  { param: "tashkilot", label: "Tashkilot", options: orgOptions },
]

export const evidenceFilters: FilterDef[] = [
  { param: "holat", label: "Tekshiruv", options: [
    { value: "yetishmaydi", label: "Yetishmaydi" },
    { value: "tekshiruvda", label: "Tekshiruvda" },
    { value: "tasdiqlangan", label: "Tasdiqlangan" },
  ] },
]

export const kpiFilters: FilterDef[] = [
  { param: "tur", label: "Tur", options: [
    { value: "osish", label: "O'sishi kerak" },
    { value: "kamayish", label: "Kamayishi kerak" },
    { value: "oraliq", label: "Maqsadli oraliq" },
    { value: "bosqich", label: "Bosqichli" },
  ] },
  { param: "holat", label: "Holat", options: [
    { value: "tasdiqlangan", label: "Tasdiqlangan" },
    { value: "hisoblanmaydi", label: "Hisoblanmaydi" },
  ] },
]

export const riskFilters: FilterDef[] = [
  { param: "daraja", label: "Daraja", options: [
    { value: "yuqori", label: "Yuqori" },
    { value: "orta", label: "O'rta" },
  ] },
]

export function displayValue(key: string, value: string) {
  if (key === "tashkilot") {
    return organizations.find((org) => org.kod === value)?.nom ?? value
  }
  if (key === "jismoniy" || key === "moliyaviy") {
    if (!value || value === "—") return "—"
    return value.endsWith("%") ? value : `${value}%`
  }
  return statusLabel[value] ?? value
}

export function exportableRows(rows: DataRow[], columns: Column[]) {
  return rows
    .filter((row) => row.maxfiylik !== "maxfiy")
    .map((row) => {
      const next: Record<string, string> = {}
      columns.forEach((column) => {
        next[column.key] = displayValue(column.key, row[column.key] ?? "")
      })
      return next
    })
}
