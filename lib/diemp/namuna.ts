import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import path from "node:path"
import type { Database } from "sql.js"

type Pack = {
  id: string
  faylNomi: string
  matn: string
  raqam: string
  turi: string
  nomi: string
  sana: string
  topshiriq: string
  tashkilot: string
  muddat: string
  holat: string
  dalilId: string
  dalilFayl: string
  dalilTur: string
  dalilNom: string
  dalilIzoh: string
}

const packs: Pack[] = [
  {
    id: "namuna-qr-11",
    faylNomi: "qaror-qr-11.docx",
    matn: "Qaror QR-11. Sana 15.03.2026. Iqtisodiyot vazirligi 30.09.2026 sanasigacha 12 ta obekt boyicha qurilish ish hajmini topshirsin. Dalil sifatida qurilish maydonining surati kerak.",
    raqam: "QR-11",
    turi: "qaror",
    nomi: "12 ta obekt qurilish hajmi",
    sana: "15.03.2026",
    topshiriq: "12 ta obekt boyicha qurilish ish hajmini topshirish",
    tashkilot: "iqtisod",
    muddat: "30.09.2026",
    holat: "ijroda",
    dalilId: "dalil-qurilish",
    dalilFayl: "dalil-qurilish.jpg",
    dalilTur: "jpg",
    dalilNom: "Qurilish maydoni surati",
    dalilIzoh: "Topshiriq qurilish maydoni suratini soraydi.",
  },
  {
    id: "namuna-fr-22",
    faylNomi: "farmoyish-fr-22.docx",
    matn: "Farmoyish FR-22. Sana 03.02.2026. Sog'liqni saqlash vazirligi 12.04.2026 sanasigacha 48 ta tibbiy uskunani yetkazib berilganini tasdiqlasin. Dalil tibbiy uskunani korsatishi kerak.",
    raqam: "FR-22",
    turi: "farmoyish",
    nomi: "48 ta tibbiy uskuna",
    sana: "03.02.2026",
    topshiriq: "48 ta tibbiy uskuna yetkazib berilganini tasdiqlash",
    tashkilot: "sogliq",
    muddat: "12.04.2026",
    holat: "muddati_otgan",
    dalilId: "dalil-stullar",
    dalilFayl: "dalil-stullar.jpg",
    dalilTur: "jpg",
    dalilNom: "Ofis stullari surati",
    dalilIzoh: "Bu surat tibbiy uskunani korsatmaydi. Moslik tekshiruvi uchun.",
  },
  {
    id: "namuna-by-33",
    faylNomi: "bayon-by-33.docx",
    matn: "Bayon BY-33. Sana 20.01.2026. Raqamli texnologiyalar vazirligi 28.01.2026 sanasigacha davlat xizmatlari portalini ishga tushirsin. Dalil portal ekranining surati kerak.",
    raqam: "BY-33",
    turi: "bayon",
    nomi: "Davlat xizmatlari portali",
    sana: "20.01.2026",
    topshiriq: "Davlat xizmatlari portalini ishga tushirish",
    tashkilot: "raqamli",
    muddat: "28.01.2026",
    holat: "yakunlangan",
    dalilId: "dalil-portal",
    dalilFayl: "dalil-portal.jpg",
    dalilTur: "jpg",
    dalilNom: "Portal ekrani surati",
    dalilIzoh: "Topshiriq portal ekranining suratini soraydi.",
  },
]

function hasRow(database: Database, sql: string) {
  const result = database.exec(sql)
  return Boolean(result[0]?.values?.length)
}

export function seedNamuna(database: Database, dataDir: string) {
  const root = path.join(process.cwd(), "content", "namuna")
  if (!existsSync(path.join(root, "qaror-qr-11.docx"))) return false
  if (hasRow(database, "SELECT id FROM hujjat WHERE id = 'namuna-qr-11'")) return false

  const hujjatDir = path.join(dataDir, "hujjatlar")
  const dalilDir = path.join(dataDir, "dalillar")
  mkdirSync(hujjatDir, { recursive: true })
  mkdirSync(dalilDir, { recursive: true })
  const now = new Date().toISOString()

  for (const pack of packs) {
    const hujjatFayl = path.join(hujjatDir, `${pack.id}.docx`)
    const dalilFayl = path.join(dalilDir, pack.dalilFayl)
    copyFileSync(path.join(root, pack.faylNomi), hujjatFayl)
    copyFileSync(path.join(root, pack.dalilFayl), dalilFayl)
    const taskId = `${pack.raqam}-01`
    const draft = {
      raqam: pack.raqam,
      nomi: pack.nomi,
      sana: pack.sana,
      aniqlanmagan: [],
      topshiriqlar: [{ matn: pack.topshiriq, muddat: pack.muddat, tashkilot: pack.tashkilot, parchasi: pack.matn }],
    }
    database.run(
      "INSERT INTO hujjat (id, nom, tur, fayl, matn, holat, yuklovchi, yaratilgan, cheklov) VALUES (?, ?, 'docx', ?, ?, 'tasdiqlangan', 'namuna', ?, '')",
      [pack.id, pack.faylNomi, hujjatFayl, pack.matn, now],
    )
    database.run("INSERT INTO ajratma (hujjat, json) VALUES (?, ?)", [pack.id, JSON.stringify(draft)])
    database.run(
      "INSERT INTO qaror (raqam, hujjat, nomi, sana, topshiriq, turi) VALUES (?, ?, ?, ?, 1, ?)",
      [pack.raqam, pack.id, pack.nomi, pack.sana, pack.turi],
    )
    database.run(
      "INSERT INTO topshiriq (raqam, qaror, hujjat, matn, tashkilot, muddat, holat) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [taskId, pack.raqam, pack.id, pack.topshiriq, pack.tashkilot, pack.muddat, pack.holat],
    )
    database.run(
      "INSERT INTO dalil (id, topshiriq, hujjat, nom, tur, fayl, holat, izoh) VALUES (?, ?, ?, ?, ?, ?, 'tekshiruvda', ?)",
      [pack.dalilId, taskId, pack.id, pack.dalilNom, pack.dalilTur, dalilFayl, pack.dalilIzoh],
    )
  }
  return true
}
