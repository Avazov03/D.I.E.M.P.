import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { connection } from "next/server"
import initSqlJs, { type Database as SqlDatabase } from "sql.js"
import type { Draft } from "@/lib/diemp/draft"
import { seedNamuna } from "@/lib/diemp/namuna"

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
const file = path.join(dir, "diemp.sqlite")

let wasm: Promise<Awaited<ReturnType<typeof initSqlJs>>> | null = null

function engine() {
  if (!wasm) {
    wasm = initSqlJs({
      locateFile: () => path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    })
  }
  return wasm
}

async function open() {
  await connection()
  const SQL = await engine()
  const database = existsSync(file) ? new SQL.Database(readFileSync(file)) : new SQL.Database()
  database.run(`
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
        CREATE TABLE IF NOT EXISTS dalil (
          id TEXT PRIMARY KEY,
          topshiriq TEXT NOT NULL,
          hujjat TEXT NOT NULL,
          nom TEXT NOT NULL,
          tur TEXT NOT NULL,
          fayl TEXT NOT NULL,
          holat TEXT NOT NULL,
          izoh TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS baholash (
          id TEXT PRIMARY KEY,
          json TEXT NOT NULL
        );
      `)
  for (const sql of [
    "ALTER TABLE topshiriq ADD COLUMN holat TEXT NOT NULL DEFAULT 'ijroda'",
    "ALTER TABLE qaror ADD COLUMN turi TEXT NOT NULL DEFAULT 'qaror'",
  ]) {
    try {
      database.run(sql)
    } catch {
      // ustun allaqachon bor
    }
  }
  if (seedNamuna(database, dir)) writeFileSync(file, Buffer.from(database.export()))
  return database
}

function text(value: unknown) {
  return value == null ? "" : String(value)
}

function one(database: SqlDatabase, sql: string, params: (string | number)[] = []) {
  const statement = database.prepare(sql)
  statement.bind(params)
  const row = statement.step() ? statement.getAsObject() : undefined
  statement.free()
  return row
}

function many(database: SqlDatabase, sql: string, params: (string | number)[] = []) {
  const statement = database.prepare(sql)
  statement.bind(params)
  const rows = []
  while (statement.step()) rows.push(statement.getAsObject())
  statement.free()
  return rows
}

function persist(database: SqlDatabase) {
  writeFileSync(file, Buffer.from(database.export()))
  database.close()
}

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

export async function saveDocument(row: Omit<StoredDocument, "ajratma">, draft: Draft | null) {
  const database = await open()
  database.run(
    "INSERT INTO hujjat (id, nom, tur, fayl, matn, holat, yuklovchi, yaratilgan, cheklov) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [row.id, row.nom, row.tur, row.fayl, row.matn, row.holat, row.yuklovchi, row.yaratilgan, row.cheklov],
  )
  if (draft) database.run("INSERT INTO ajratma (hujjat, json) VALUES (?, ?)", [row.id, JSON.stringify(draft)])
  persist(database)
}

export async function listDocuments() {
  const database = await open()
  const rows = many(database, "SELECT id, nom, tur, holat, yuklovchi, yaratilgan, cheklov FROM hujjat ORDER BY yaratilgan DESC")
  database.close()
  return rows.map((row) => ({
    id: text(row.id),
    nom: text(row.nom),
    tur: text(row.tur) as "pdf" | "docx",
    holat: text(row.holat),
    yuklovchi: text(row.yuklovchi),
    yaratilgan: text(row.yaratilgan),
    cheklov: text(row.cheklov),
  }))
}

export async function documentById(id: string): Promise<StoredDocument | null> {
  const database = await open()
  const row = one(database, "SELECT * FROM hujjat WHERE id = ?", [id])
  if (!row) {
    database.close()
    return null
  }
  const draft = one(database, "SELECT json FROM ajratma WHERE hujjat = ?", [id])
  database.close()
  const tur = text(row.tur) === "pdf" ? "pdf" : "docx"
  return {
    id: text(row.id),
    nom: text(row.nom),
    tur,
    fayl: text(row.fayl),
    matn: text(row.matn),
    holat: text(row.holat),
    yuklovchi: text(row.yuklovchi),
    yaratilgan: text(row.yaratilgan),
    cheklov: text(row.cheklov),
    ajratma: draftFrom(draft ? text(draft.json) : undefined),
  }
}

export async function confirmDocument(id: string, draft: Draft) {
  const database = await open()
  const existing = one(database, "SELECT hujjat FROM qaror WHERE raqam = ?", [draft.raqam])
  if (existing && text(existing.hujjat) !== id) {
    database.close()
    return { ok: false as const, xato: "Bu qaror raqami boshqa hujjatda bor. Eski yozuv o'zgartirilmadi." }
  }
  const tasks = draft.topshiriqlar.filter((task) => task.matn.trim())
  database.run("UPDATE hujjat SET holat = 'tasdiqlangan' WHERE id = ?", [id])
  database.run("INSERT INTO ajratma (hujjat, json) VALUES (?, ?) ON CONFLICT(hujjat) DO UPDATE SET json = excluded.json", [id, JSON.stringify({ ...draft, topshiriqlar: tasks })])
  database.run("DELETE FROM topshiriq WHERE hujjat = ?", [id])
  database.run(
    "INSERT INTO qaror (raqam, hujjat, nomi, sana, topshiriq) VALUES (?, ?, ?, ?, ?) ON CONFLICT(raqam) DO UPDATE SET nomi = excluded.nomi, sana = excluded.sana, topshiriq = excluded.topshiriq, hujjat = excluded.hujjat",
    [draft.raqam, id, draft.nomi, draft.sana, tasks.length],
  )
  tasks.forEach((task, index) => {
    const nomer = `${draft.raqam}-${String(index + 1).padStart(2, "0")}`
    database.run(
      "INSERT INTO topshiriq (raqam, qaror, hujjat, matn, tashkilot, muddat) VALUES (?, ?, ?, ?, ?, ?)",
      [nomer, draft.raqam, id, task.matn.trim(), task.tashkilot, task.muddat.trim()],
    )
  })
  persist(database)
  return { ok: true as const }
}

export async function storedDecisions() {
  const database = await open()
  const rows = many(database, "SELECT raqam, nomi, sana, topshiriq, hujjat, turi FROM qaror ORDER BY raqam")
  database.close()
  return rows.map((row) => ({
    raqam: text(row.raqam),
    nomi: text(row.nomi),
    sana: text(row.sana),
    turi: text(row.turi) || "qaror",
    topshiriq: Number(row.topshiriq) || 0,
    hujjat: text(row.hujjat),
  }))
}

export async function storedTasks() {
  const database = await open()
  const rows = many(database, "SELECT raqam, qaror, matn, tashkilot, muddat, hujjat, holat FROM topshiriq ORDER BY raqam")
  database.close()
  return rows.map((row) => ({
    raqam: text(row.raqam),
    qaror: text(row.qaror),
    matn: text(row.matn),
    tashkilot: text(row.tashkilot),
    muddat: text(row.muddat),
    hujjat: text(row.hujjat),
    holat: text(row.holat) || "ijroda",
  }))
}

export type StoredEvidence = {
  id: string
  topshiriq: string
  hujjat: string
  nom: string
  tur: string
  fayl: string
  holat: string
  izoh: string
}

export async function storedEvidence() {
  const database = await open()
  const rows = many(database, "SELECT id, topshiriq, hujjat, nom, tur, fayl, holat, izoh FROM dalil ORDER BY id")
  database.close()
  return rows.map((row) => ({
    id: text(row.id),
    topshiriq: text(row.topshiriq),
    hujjat: text(row.hujjat),
    nom: text(row.nom),
    tur: text(row.tur),
    fayl: text(row.fayl),
    holat: text(row.holat),
    izoh: text(row.izoh),
  }))
}

export async function evidenceById(id: string) {
  const database = await open()
  const row = one(database, "SELECT id, topshiriq, hujjat, nom, tur, fayl, holat, izoh FROM dalil WHERE id = ?", [id])
  database.close()
  if (!row) return null
  return {
    id: text(row.id),
    topshiriq: text(row.topshiriq),
    hujjat: text(row.hujjat),
    nom: text(row.nom),
    tur: text(row.tur),
    fayl: text(row.fayl),
    holat: text(row.holat),
    izoh: text(row.izoh),
  }
}

export async function setEvidenceStatus(id: string, holat: string) {
  const database = await open()
  const row = one(database, "SELECT topshiriq FROM dalil WHERE id = ?", [id])
  database.run("UPDATE dalil SET holat = ? WHERE id = ?", [holat, id])
  if (row) {
    const taskStatus = holat === "tasdiqlangan" ? "yakunlangan" : holat === "yetishmaydi" ? "qaytarilgan" : "ijroda"
    database.run("UPDATE topshiriq SET holat = ? WHERE raqam = ?", [taskStatus, text(row.topshiriq)])
  }
  persist(database)
}

export async function setEvidenceNote(id: string, izoh: string) {
  const database = await open()
  database.run("UPDATE dalil SET izoh = ? WHERE id = ?", [izoh.slice(0, 500), id])
  persist(database)
}

export async function replaceProof(row: { id: string; topshiriq: string; hujjat: string; nom: string; tur: string; fayl: string; izoh: string }) {
  const database = await open()
  const old = many(database, "SELECT fayl FROM dalil WHERE topshiriq = ?", [row.topshiriq])
  database.run("DELETE FROM dalil WHERE topshiriq = ?", [row.topshiriq])
  database.run(
    "INSERT INTO dalil (id, topshiriq, hujjat, nom, tur, fayl, holat, izoh) VALUES (?, ?, ?, ?, ?, ?, 'tekshiruvda', ?)",
    [row.id, row.topshiriq, row.hujjat, row.nom, row.tur, row.fayl, row.izoh.slice(0, 500)],
  )
  database.run("UPDATE topshiriq SET holat = 'ijroda' WHERE raqam = ?", [row.topshiriq])
  persist(database)
  return old.map((item) => text(item.fayl))
}

export async function readAssessmentJson() {
  const database = await open()
  const rows = many(database, "SELECT id, json FROM baholash")
  database.close()
  return rows.map((row) => ({ id: text(row.id), json: text(row.json) }))
}

export async function writeAssessmentJson(id: string, json: string) {
  const database = await open()
  database.run(
    "INSERT INTO baholash (id, json) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET json = excluded.json",
    [id, json],
  )
  persist(database)
}
