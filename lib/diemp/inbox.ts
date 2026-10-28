import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { dataDir } from "@/lib/diemp/db"
import type { DataRow } from "@/lib/diemp/sample"

type Box = { rows: DataRow[]; sequence: number }

function inboxFile() {
  return path.join(dataDir(), "inbox.json")
}

function read(): Box {
  try {
    const parsed = JSON.parse(readFileSync(inboxFile(), "utf8")) as Box
    if (!Array.isArray(parsed.rows) || typeof parsed.sequence !== "number") throw new Error("box")
    return parsed
  } catch {
    return { rows: [], sequence: 200 }
  }
}

function write(box: Box) {
  const file = inboxFile()
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(box))
}

export function extraReports() {
  return read().rows
}

export function submitReport(tashkilot: string, topshiriq: string, matn: string) {
  const box = read()
  const row: DataRow = {
    raqam: `HS-${box.sequence}`,
    topshiriq,
    davr: "2026-IV",
    tashkilot,
    holat: "kutilmoqda",
    hajm: "—",
    muammo: matn,
  }
  box.sequence += 1
  box.rows.push(row)
  write(box)
  return row
}
