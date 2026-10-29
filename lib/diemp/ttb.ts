import type { Column, DataRow, FilterDef } from "@/lib/diemp/sample"

export type AssessmentType = "dastlabki" | "keyingi"
export type AssessmentStatus = "qoralama" | "tekshiruvda" | "qaytarilgan" | "tasdiqlangan" | "monitoring"

export type DocumentItem = {
  raqam: string
  turi: "loyixa" | "qabul_qilingan"
  hujjatTuri: "qaror" | "farmoyish" | "bayon"
  nomi: string
  soha: string
  organ: string
  holat: AssessmentStatus
  versiya: string
  oldingiVersiya: string
  oldingi: string
  matn: string
  sana: string
  maxfiylik: "ichki" | "maxfiy"
}

export type Assessment = {
  id: string
  hujjat: string
  turi: AssessmentType
  holat: AssessmentStatus
  muammo: string
  maqsad: string
  muqobil: string
  tadbirkor: string
  fuqaro: string
  davlat: string
  xarajat: string
  foyda: string
  yuk: string
  xarajatTasdiq: "ha" | "yoq"
  foydaTasdiq: "ha" | "yoq"
  yukTasdiq: "ha" | "yoq"
  reja: string
  haqiqiy: string
  rejaTasdiq: "ha" | "yoq"
  haqiqiyTasdiq: "ha" | "yoq"
  organ: string
  masul: string
  yangilangan: string
}

export const organs = [
  { kod: "iqtisod", nom: "Iqtisodiyot vazirligi" },
  { kod: "qurilish", nom: "Qurilish vazirligi" },
  { kod: "sogliq", nom: "Sog'liqni saqlash vazirligi" },
  { kod: "transport", nom: "Transport vazirligi" },
  { kod: "raqamli", nom: "Raqamli texnologiyalar vazirligi" },
]

export const documents: DocumentItem[] = [
  {
    raqam: "TTB-01", turi: "loyixa", hujjatTuri: "qaror", nomi: "Kichik biznes litsenziyasini soddalashtirish", soha: "Tadbirkorlik", organ: "iqtisod", holat: "tekshiruvda", versiya: "1.1", oldingiVersiya: "1.0", sana: "12.03.2026", maxfiylik: "ichki",
    oldingi: "Litsenziya uchun 7 ta hujjat talab qilinadi.\nMuddat 15 kun.\nTo'lov naqd qabul qilinadi.",
    matn: "Litsenziya uchun 4 ta hujjat talab qilinadi.\nMuddat 5 kun.\nTo'lov naqd qabul qilinadi.",
  },
  {
    raqam: "TTB-02", turi: "qabul_qilingan", hujjatTuri: "farmoyish", nomi: "Qurilish ruxsatnomasi muddatlarini qisqartirish", soha: "Qurilish", organ: "qurilish", holat: "monitoring", versiya: "2.0", oldingiVersiya: "1.3", sana: "20.01.2026", maxfiylik: "ichki",
    oldingi: "Ruxsat muddati 40 kun.\nQo'lda navbat.",
    matn: "Ruxsat muddati 20 kun.\nElektron navbat.",
  },
  {
    raqam: "TTB-03", turi: "loyixa", hujjatTuri: "bayon", nomi: "Elektron tibbiy yo'llanma tartibi", soha: "Sog'liq", organ: "sogliq", holat: "qoralama", versiya: "0.9", oldingiVersiya: "0.8", sana: "05.04.2026", maxfiylik: "ichki",
    oldingi: "Yo'llanma qog'ozda beriladi.",
    matn: "Yo'llanma elektron ariza orqali beriladi.",
  },
  {
    raqam: "TTB-04", turi: "qabul_qilingan", hujjatTuri: "qaror", nomi: "Yuk tashishga elektron ruxsat", soha: "Transport", organ: "transport", holat: "tasdiqlangan", versiya: "1.0", oldingiVersiya: "0.4", sana: "18.02.2026", maxfiylik: "ichki",
    oldingi: "Ruxsatnoma qog'oz blankada.",
    matn: "Ruxsatnoma elektron reyestrda.",
  },
  {
    raqam: "TTB-05", turi: "loyixa", hujjatTuri: "farmoyish", nomi: "Davlat xizmatlari portalini kengaytirish", soha: "Raqamlashtirish", organ: "raqamli", holat: "qaytarilgan", versiya: "1.2", oldingiVersiya: "1.1", sana: "28.03.2026", maxfiylik: "ichki",
    oldingi: "Portalda 8 ta xizmat bor.",
    matn: "Portalda 12 ta xizmat rejalashtirilgan.",
  },
  {
    raqam: "TTB-06", turi: "loyixa", hujjatTuri: "qaror", nomi: "Maxfiy tartibga solish choralari (namuna)", soha: "Ichki", organ: "iqtisod", holat: "qoralama", versiya: "0.1", oldingiVersiya: "0.1", sana: "01.04.2026", maxfiylik: "maxfiy",
    oldingi: "Maxfiy matn ko'rsatilmaydi.",
    matn: "Maxfiy matn ko'rsatilmaydi.",
  },
]

export const assessments: Assessment[] = [
  {
    id: "BH-01",
    hujjat: "TTB-01",
    turi: "dastlabki",
    holat: "tekshiruvda",
    muammo: "Litsenziya olish uchun 7 ta ortiqcha hujjat talab qilinadi.",
    maqsad: "Tadbirkorlik yukini kamaytirish va muddatni 15 kundan 5 kunga tushirish.",
    muqobil: "1) Status-kvo. 2) Hujjatlar sonini 3 taga kamaytirish. 3) To'liq elektron ariza.",
    tadbirkor: "Ariza beruvchilar vaqti va to'lovlari kamayadi.",
    fuqaro: "Xizmat sifati oshishi kutiladi, bevosita xarajat past.",
    davlat: "Tekshiruv hajmi kamayadi, axborot tizimi yangilanadi.",
    xarajat: "120",
    foyda: "480",
    yuk: "35",
    xarajatTasdiq: "ha",
    foydaTasdiq: "ha",
    yukTasdiq: "ha",
    reja: "70",
    haqiqiy: "",
    rejaTasdiq: "ha",
    haqiqiyTasdiq: "yoq",
    organ: "iqtisod",
    masul: "Baholovchi mutaxassis",
    yangilangan: "27.10.2026",
  },
  {
    id: "BH-02",
    hujjat: "TTB-02",
    turi: "keyingi",
    holat: "monitoring",
    muammo: "Ruxsatnoma muddati uzoqligi qurilishni kechiktirgan.",
    maqsad: "O'rtacha muddatni 40 kundan 20 kunga tushirish.",
    muqobil: "1) Status-kvo. 2) Parallel ko'rib chiqish. 3) Bir oynali markaz.",
    tadbirkor: "Kechikish xarajati kamaydi.",
    fuqaro: "Uy-joy va ijtimoiy obektlar tezroq ishga tushadi.",
    davlat: "Nazorat jarayoni raqamlashtiriladi.",
    xarajat: "90",
    foyda: "310",
    yuk: "22",
    xarajatTasdiq: "ha",
    foydaTasdiq: "ha",
    yukTasdiq: "ha",
    reja: "50",
    haqiqiy: "42",
    rejaTasdiq: "ha",
    haqiqiyTasdiq: "ha",
    organ: "qurilish",
    masul: "Organ koordinatori",
    yangilangan: "26.10.2026",
  },
  {
    id: "BH-03",
    hujjat: "TTB-03",
    turi: "dastlabki",
    holat: "qoralama",
    muammo: "Qog'oz yo'llanma sababli navbat va xato ko'p.",
    maqsad: "Elektron yo'llanmani joriy etish.",
    muqobil: "1) Status-kvo. 2) Qisman elektron. 3) To'liq elektron.",
    tadbirkor: "Klinikalar uchun dastlabki integratsiya xarajati bor.",
    fuqaro: "Navbat va takroriy tashrif kamayadi.",
    davlat: "Hisobotlar avtomatlashadi.",
    xarajat: "200",
    foyda: "",
    yuk: "18",
    xarajatTasdiq: "yoq",
    foydaTasdiq: "yoq",
    yukTasdiq: "yoq",
    reja: "",
    haqiqiy: "",
    rejaTasdiq: "yoq",
    haqiqiyTasdiq: "yoq",
    organ: "sogliq",
    masul: "Baholovchi mutaxassis",
    yangilangan: "28.10.2026",
  },
  {
    id: "BH-04",
    hujjat: "TTB-04",
    turi: "keyingi",
    holat: "tasdiqlangan",
    muammo: "Yuk ruxsatlari qog'ozda berilgan.",
    maqsad: "Elektron ruxsatni to'liq joriy etish.",
    muqobil: "1) Status-kvo. 2) Gibrid. 3) To'liq elektron.",
    tadbirkor: "Kutish vaqti kamaydi.",
    fuqaro: "Yo'l xavfsizligi nazorati yaxshilanadi.",
    davlat: "Nazorat ma'lumoti markazlashadi.",
    xarajat: "150",
    foyda: "260",
    yuk: "28",
    xarajatTasdiq: "ha",
    foydaTasdiq: "ha",
    yukTasdiq: "ha",
    reja: "60",
    haqiqiy: "58",
    rejaTasdiq: "ha",
    haqiqiyTasdiq: "ha",
    organ: "transport",
    masul: "Ekspert",
    yangilangan: "25.10.2026",
  },
  {
    id: "BH-05",
    hujjat: "TTB-05",
    turi: "dastlabki",
    holat: "qaytarilgan",
    muammo: "Portal xizmatlari to'liq emas.",
    maqsad: "Yana 12 ta xizmatni portalga ulash.",
    muqobil: "1) Status-kvo. 2) Bosqichma-bosqich. 3) Bir martalik kengaytirish.",
    tadbirkor: "Masofaviy murojaat osonlashadi.",
    fuqaro: "Navbat qisqaradi.",
    davlat: "Xizmat markazlari yukini kamaytiradi.",
    xarajat: "80",
    foyda: "100",
    yuk: "12",
    xarajatTasdiq: "yoq",
    foydaTasdiq: "yoq",
    yukTasdiq: "yoq",
    reja: "40",
    haqiqiy: "",
    rejaTasdiq: "yoq",
    haqiqiyTasdiq: "yoq",
    organ: "raqamli",
    masul: "Baholovchi mutaxassis",
    yangilangan: "24.10.2026",
  },
]

export const methodologyNote =
  "Maydonlar namuna. Tasdiqlangan uslubiyot va hisobot shakli kelgach shu shakl almashtiriladi. Platforma o'zicha yangi majburiy talab yaratmaydi."

export function organName(kod: string) {
  return organs.find((item) => item.kod === kod)?.nom ?? kod
}

export function namunaOchilgan() {
  return process.env.DIEMP_NAMUNA === "1"
}

export function visibleDocuments() {
  if (!namunaOchilgan()) return []
  return documents.filter((row) => row.maxfiylik !== "maxfiy")
}

export function visibleAssessments(source: Assessment[] = assessments) {
  if (!namunaOchilgan()) return []
  return source.filter((row) => {
    const doc = documents.find((item) => item.raqam === row.hujjat)
    return doc?.maxfiylik !== "maxfiy"
  })
}

export function amount(value: string) {
  const trimmed = value.trim()
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null
  return Number(trimmed)
}

export function assessmentGaps(row: Assessment, holat: AssessmentStatus) {
  const gaps: string[] = []
  if (!row.muammo.trim()) gaps.push("Muammo")
  if (!row.maqsad.trim()) gaps.push("Maqsad")
  if (!row.muqobil.trim()) gaps.push("Muqobil yechimlar")
  if (holat === "tasdiqlangan") {
    if (!row.tadbirkor.trim()) gaps.push("Tadbirkorlik")
    if (!row.fuqaro.trim()) gaps.push("Fuqarolar")
    if (!row.davlat.trim()) gaps.push("Davlat organlari")
    if (amount(row.xarajat) === null) gaps.push("Xarajat")
    if (amount(row.foyda) === null) gaps.push("Foyda")
  }
  return gaps
}

export function money(value: string, flag: "ha" | "yoq") {
  if (flag !== "ha") return null
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : null
}

export function netEffect(row: Assessment) {
  const cost = money(row.xarajat, row.xarajatTasdiq)
  const benefit = money(row.foyda, row.foydaTasdiq)
  if (cost === null || benefit === null) return null
  return benefit - cost
}

export function burden(row: Assessment) {
  return money(row.yuk, row.yukTasdiq)
}

export function outcomeGap(row: Assessment) {
  const planned = money(row.reja, row.rejaTasdiq)
  const actual = money(row.haqiqiy, row.haqiqiyTasdiq)
  if (planned === null || actual === null || planned === 0) return null
  return Math.round((actual / planned) * 100)
}

export function averageNet(source?: Assessment[]) {
  const values = visibleAssessments(source).map(netEffect).filter((value): value is number => value !== null)
  if (!values.length) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function averageBurden(source?: Assessment[]) {
  const values = visibleAssessments(source).map(burden).filter((value): value is number => value !== null)
  if (!values.length) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function averageOutcome(source?: Assessment[]) {
  const values = visibleAssessments(source).map(outcomeGap).filter((value): value is number => value !== null)
  if (!values.length) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function countStatus(status: AssessmentStatus, source?: Assessment[]) {
  return visibleAssessments(source).filter((row) => row.holat === status).length
}

export function assessmentRows(source?: Assessment[]): DataRow[] {
  return visibleAssessments(source).map((row) => ({
    raqam: row.id,
    hujjat: row.hujjat,
    turi: row.turi,
    holat: row.holat,
    organ: row.organ,
    sof: netEffect(row) === null ? "—" : String(netEffect(row)),
    yuk: burden(row) === null ? "—" : String(burden(row)),
    natija: outcomeGap(row) === null ? "Hisoblanmaydi" : `${outcomeGap(row)}%`,
    masul: row.masul,
    yangilangan: row.yangilangan,
  }))
}

export function documentRows(): DataRow[] {
  return visibleDocuments().map((row) => ({
    raqam: row.raqam,
    turi: row.turi,
    hujjatTuri: row.hujjatTuri,
    nomi: row.nomi,
    soha: row.soha,
    organ: row.organ,
    holat: row.holat,
    versiya: row.versiya,
    sana: row.sana,
  }))
}

export function reportRows(source?: Assessment[]): DataRow[] {
  return visibleAssessments(source).map((row) => ({
    raqam: `HS-${row.id}`,
    hujjat: row.hujjat,
    turi: row.turi,
    holat: row.holat === "tasdiqlangan" || row.holat === "monitoring" ? "tasdiqlangan" : row.holat === "qaytarilgan" ? "qaytarilgan" : "kutilmoqda",
    organ: row.organ,
    shakl: "Namuna hisobot shakli",
    fayl: row.id,
    yangilangan: row.yangilangan,
  }))
}

export function monitoringRows(source?: Assessment[]): DataRow[] {
  return visibleAssessments(source)
    .filter((row) => row.turi === "keyingi" || row.holat === "monitoring" || row.holat === "tasdiqlangan")
    .map((row) => ({
      raqam: row.id,
      hujjat: row.hujjat,
      organ: row.organ,
      reja: money(row.reja, row.rejaTasdiq) === null ? "—" : row.reja,
      haqiqiy: money(row.haqiqiy, row.haqiqiyTasdiq) === null ? "—" : row.haqiqiy,
      natija: outcomeGap(row) === null ? "Hisoblanmaydi" : `${outcomeGap(row)}%`,
      holat: row.holat,
      yangilangan: row.yangilangan,
    }))
}

export function monthSeries() {
  const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt"]
  const closedByMonth = namunaOchilgan() ? [0, 0, 1, 0, 1, 0, 1, 0, 0, 1] : months.map(() => 0)
  const draftByMonth = namunaOchilgan() ? [1, 0, 0, 1, 0, 1, 0, 1, 0, 1] : months.map(() => 0)
  return months.map((oy, index) => ({
    oy,
    yopilgan: closedByMonth[index] ?? 0,
    otgan: draftByMonth[index] ?? 0,
  }))
}

export function statusShare(source?: Assessment[]) {
  const rows = visibleAssessments(source)
  const keys = ["tasdiqlangan", "tekshiruvda", "qoralama"] as const
  const mapped = rows.map((row) => {
    if (row.holat === "monitoring") return "tasdiqlangan"
    if (row.holat === "qaytarilgan") return "qoralama"
    return row.holat
  })
  const total = mapped.length
  return {
    total,
    parts: keys.map((key) => {
      const count = mapped.filter((item) => item === key).length
      return { key, count, percent: total ? Math.round((count / total) * 100) : null }
    }),
  }
}

export const documentColumns: Column[] = [
  { key: "raqam", label: "Raqam" },
  { key: "turi", label: "Reyestr turi" },
  { key: "hujjatTuri", label: "Hujjat turi" },
  { key: "nomi", label: "Nomi" },
  { key: "soha", label: "Soha" },
  { key: "organ", label: "Mas'ul organ" },
  { key: "holat", label: "Holat", kind: "status" },
  { key: "versiya", label: "Versiya" },
  { key: "sana", label: "Sana" },
]

export const assessmentColumns: Column[] = [
  { key: "raqam", label: "Baholash" },
  { key: "hujjat", label: "Hujjat" },
  { key: "turi", label: "Baholash turi" },
  { key: "holat", label: "Holat", kind: "status" },
  { key: "organ", label: "Organ" },
  { key: "sof", label: "Sof ta'sir" },
  { key: "yuk", label: "Ma'muriy yuk" },
  { key: "natija", label: "Natija" },
  { key: "masul", label: "Mas'ul" },
  { key: "yangilangan", label: "Yangilangan" },
]

export const reportColumns: Column[] = [
  { key: "raqam", label: "Hisobot" },
  { key: "hujjat", label: "Hujjat" },
  { key: "turi", label: "Baholash turi" },
  { key: "holat", label: "Holat", kind: "status" },
  { key: "organ", label: "Organ" },
  { key: "shakl", label: "Shakl" },
  { key: "fayl", label: "Format", kind: "files" },
  { key: "yangilangan", label: "Yangilangan" },
]

export const monitoringColumns: Column[] = [
  { key: "raqam", label: "Baholash" },
  { key: "hujjat", label: "Hujjat" },
  { key: "organ", label: "Organ" },
  { key: "reja", label: "Reja" },
  { key: "haqiqiy", label: "Haqiqiy" },
  { key: "natija", label: "Bajarilish" },
  { key: "holat", label: "Holat", kind: "status" },
  { key: "yangilangan", label: "Yangilangan" },
]

const organOptions = organs.map((item) => ({ value: item.kod, label: item.nom }))

export const documentFilters: FilterDef[] = [
  { param: "turi", label: "Reyestr", options: [
    { value: "loyixa", label: "Loyiha" },
    { value: "qabul_qilingan", label: "Qabul qilingan" },
  ] },
  { param: "holat", label: "Holat", options: [
    { value: "qoralama", label: "Qoralama" },
    { value: "tekshiruvda", label: "Tekshiruvda" },
    { value: "qaytarilgan", label: "Qaytarilgan" },
    { value: "tasdiqlangan", label: "Tasdiqlangan" },
    { value: "monitoring", label: "Monitoring" },
  ] },
  { param: "organ", label: "Organ", options: organOptions },
]

export const assessmentFilters: FilterDef[] = [
  { param: "turi", label: "Tur", options: [
    { value: "dastlabki", label: "Dastlabki TTB" },
    { value: "keyingi", label: "Keyingi TTB" },
  ] },
  { param: "holat", label: "Holat", options: [
    { value: "qoralama", label: "Qoralama" },
    { value: "tekshiruvda", label: "Tekshiruvda" },
    { value: "qaytarilgan", label: "Qaytarilgan" },
    { value: "tasdiqlangan", label: "Tasdiqlangan" },
    { value: "monitoring", label: "Monitoring" },
  ] },
  { param: "organ", label: "Organ", options: organOptions },
]

export const reportFilters: FilterDef[] = [
  { param: "holat", label: "Holat", options: [
    { value: "kutilmoqda", label: "Tasdiq kutilmoqda" },
    { value: "qaytarilgan", label: "Qaytarilgan" },
    { value: "tasdiqlangan", label: "Tasdiqlangan" },
  ] },
  { param: "organ", label: "Organ", options: organOptions },
]

export const monitoringFilters: FilterDef[] = [
  { param: "holat", label: "Holat", options: [
    { value: "tasdiqlangan", label: "Tasdiqlangan" },
    { value: "monitoring", label: "Monitoring" },
  ] },
  { param: "organ", label: "Organ", options: organOptions },
]

export function assessmentById(id: string) {
  return assessments.find((row) => row.id === id) ?? null
}

export function documentByNumber(raqam: string) {
  if (!namunaOchilgan()) return null
  return documents.find((row) => row.raqam === raqam) ?? null
}
