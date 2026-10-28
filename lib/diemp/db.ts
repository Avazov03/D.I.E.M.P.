import { mkdirSync } from "node:fs"
import path from "node:path"
import Database from "better-sqlite3"
import type { Draft } from "@/lib/diemp/draft"

export type { Draft, DraftTask } from "@/lib/diemp/draft"

export type StoredDocument = {
  id: string
  nom: string
  tur: "pdf" | "docx"
  fayl: string
  matn: string
  holat: string
  yuklovchi: string
  yaratilgan: string
  cheklov: string
  ajratma: Draft | null
}

const dir = process.env.DIEMP_DATA_DIR || path.join(process.cwd(), "data")
mkdirSync(dir, { recursive: true })

const database = new Database(path.join(dir, "diemp.sqlite"))
database.pragma("journal_mode = WAL")
database.exec(`
  CREATE TABLE IF NOT EXISTS hujjat (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    tur TEXT NOT NULL,
    fayl TEXT NOT NULL,
    matn TEXT NOT NULL,
    holat TEXT NOT NULL,
    yuklovchi TEXT NOT NULL,
    yaratilgan TEXT NOT NULL,
    cheklov TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS ajratma (
    hujjat TEXT PRIMARY KEY,
    json TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS qaror (
    raqam TEXT PRIMARY KEY,
    hujjat TEXT NOT NULL,
    nomi TEXT NOT NULL,
    sana TEXT NOT NULL,
    topshiriq INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS topshiriq (
    raqam TEXT PRIMARY KEY,
    qaror TEXT NOT NULL,
    hujjat TEXT NOT NULL,
    matn TEXT NOT NULL,
    tashkilot TEXT NOT NULL,
    muddat TEXT NOT NULL
  );
`)

function draftFrom(json: string | undefined): Draft | null {
  if (!json) return null
  const value = JSON.parse(json) as Draft
  return {
    raqam: value.raqam || "",
    nomi: value.nomi || "",
    sana: value.sana || "",
    aniqlanmagan: Array.isArray(value.aniqlanmagan) ? value.aniqlanmagan : [],
    topshiriqlar: Array.isArray(value.topshiriqlar) ? value.topshiriqlar : [],
  }
}

export function dataDir() {
  return dir
}

export function saveDocument(row: Omit<StoredDocument, "ajratma">, draft: Draft | null) {
  const insert = database.prepare(`
    INSERT INTO hujjat (id, nom, tur, fayl, matn, holat, yuklovchi, yaratilgan, cheklov)
    VALUES (@id, @nom, @tur, @fayl, @matn, @holat, @yuklovchi, @yaratilgan, @cheklov)
  `)
  const insertDraft = database.prepare("INSERT INTO ajratma (hujjat, json) VALUES (?, ?)")
  const run = database.transaction(() => {
    insert.run(row)
    if (draft) insertDraft.run(row.id, JSON.stringify(draft))
  })
  run()
}

export function listDocuments() {
  return database.prepare("SELECT id, nom, tur, holat, yuklovchi, yaratilgan, cheklov FROM hujjat ORDER BY yaratilgan DESC").all() as Pick<StoredDocument, "id" | "nom" | "tur" | "holat" | "yuklovchi" | "yaratilgan" | "cheklov">[]
}

export function documentById(id: string): StoredDocument | null {
  const row = database.prepare("SELECT * FROM hujjat WHERE id = ?").get(id) as Omit<StoredDocument, "ajratma"> | undefined
  if (!row) return null
  const draft = database.prepare("SELECT json FROM ajratma WHERE hujjat = ?").get(id) as { json: string } | undefined
  return { ...row, ajratma: draftFrom(draft?.json) }
}

export function decisionOwner(raqam: string) {
  return database.prepare("SELECT hujjat FROM qaror WHERE raqam = ?").get(raqam) as { hujjat: string } | undefined
}

export function confirmDocument(id: string, draft: Draft) {
  const existing = decisionOwner(draft.raqam)
  if (existing && existing.hujjat !== id) return { ok: false as const, xato: "Bu qaror raqami boshqa hujjatda bor. Eski yozuv o'zgartirilmadi." }
  const tasks = draft.topshiriqlar.filter((task) => task.matn.trim())
  const write = database.transaction(() => {
    database.prepare("UPDATE hujjat SET holat = 'tasdiqlangan' WHERE id = ?").run(id)
    database.prepare("INSERT INTO ajratma (hujjat, json) VALUES (?, ?) ON CONFLICT(hujjat) DO UPDATE SET json = excluded.json").run(id, JSON.stringify({ ...draft, topshiriqlar: tasks }))
    database.prepare("DELETE FROM topshiriq WHERE hujjat = ?").run(id)
    database.prepare(`
      INSERT INTO qaror (raqam, hujjat, nomi, sana, topshiriq) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(raqam) DO UPDATE SET nomi = excluded.nomi, sana = excluded.sana, topshiriq = excluded.topshiriq, hujjat = excluded.hujjat
    `).run(draft.raqam, id, draft.nomi, draft.sana, tasks.length)
    const insertTask = database.prepare("INSERT INTO topshiriq (raqam, qaror, hujjat, matn, tashkilot, muddat) VALUES (?, ?, ?, ?, ?, ?)")
    tasks.forEach((task, index) => {
      const nomer = `${draft.raqam}-${String(index + 1).padStart(2, "0")}`
      insertTask.run(nomer, draft.raqam, id, task.matn.trim(), task.tashkilot, task.muddat.trim())
    })
  })
  write()
  return { ok: true as const }
}

export function storedDecisions() {
  return database.prepare("SELECT raqam, nomi, sana, topshiriq, hujjat FROM qaror ORDER BY raqam").all() as { raqam: string; nomi: string; sana: string; topshiriq: number; hujjat: string }[]
}

export function storedTasks() {
  return database.prepare("SELECT raqam, qaror, matn, tashkilot, muddat, hujjat FROM topshiriq ORDER BY raqam").all() as { raqam: string; qaror: string; matn: string; tashkilot: string; muddat: string; hujjat: string }[]
}
