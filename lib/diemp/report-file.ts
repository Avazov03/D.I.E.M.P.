import { organName, outcomeGap, netEffect, type Assessment, type DocumentItem } from "@/lib/diemp/ttb"

function crc32(buffer: Buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function zip(files: { name: string; data: Buffer }[]) {
  const parts: Buffer[] = []
  const central: Buffer[] = []
  let offset = 0
  for (const file of files) {
    const name = Buffer.from(file.name)
    const crc = crc32(file.data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(file.data.length, 18)
    local.writeUInt32LE(file.data.length, 22)
    parts.push(local, name, file.data)
    const entry = Buffer.alloc(46)
    entry.writeUInt32LE(0x02014b50, 0)
    entry.writeUInt16LE(20, 4)
    entry.writeUInt16LE(20, 6)
    entry.writeUInt32LE(crc, 16)
    entry.writeUInt32LE(file.data.length, 20)
    entry.writeUInt32LE(file.data.length, 24)
    entry.writeUInt16LE(name.length, 28)
    entry.writeUInt32LE(offset, 42)
    central.push(entry, name)
    offset += local.length + name.length + file.data.length
  }
  const directory = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...parts, directory, end])
}

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function pdfEscape(value: string) {
  return value.replace(/[^\x20-\x7E]/g, " ").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

export function reportLines(row: Assessment, document: DocumentItem) {
  const sof = netEffect(row)
  const natija = outcomeGap(row)
  return [
    "D.I.E.M.P. Namuna hisobot",
    "Bu tasdiqlangan idoraviy blanka emas. Uslubiyot kelgach shu shakl almashtiriladi.",
    `Baholash: ${row.id}`,
    `Hujjat: ${document.raqam}. ${document.nomi}`,
    `Versiya: ${document.versiya}`,
    `Tur: ${row.turi === "dastlabki" ? "Dastlabki" : "Keyingi"}`,
    `Holat: ${row.holat}`,
    `Organ: ${organName(row.organ)}`,
    `Yangilangan: ${row.yangilangan}`,
    "Muammo",
    row.muammo,
    "Maqsad",
    row.maqsad,
    "Muqobil yechimlar",
    row.muqobil,
    "Tadbirkorlik",
    row.tadbirkor,
    "Fuqarolar",
    row.fuqaro,
    "Davlat organlari",
    row.davlat,
    `Xarajat: ${row.xarajatTasdiq === "ha" ? row.xarajat : "Hisoblanmaydi"}`,
    `Foyda: ${row.foydaTasdiq === "ha" ? row.foyda : "Hisoblanmaydi"}`,
    `Ma'muriy yuk: ${row.yukTasdiq === "ha" ? row.yuk : "Hisoblanmaydi"}`,
    `Sof ta'sir: ${sof === null ? "Hisoblanmaydi" : String(sof)}`,
    `Reja: ${row.rejaTasdiq === "ha" ? row.reja || "Hisoblanmaydi" : "Hisoblanmaydi"}`,
    `Haqiqiy: ${row.haqiqiyTasdiq === "ha" ? row.haqiqiy || "Hisoblanmaydi" : "Hisoblanmaydi"}`,
    `Reja bajarilishi: ${natija === null ? "Hisoblanmaydi" : `${natija}%`}`,
  ]
}

export function reportDocx(lines: string[]) {
  const body = lines.map((line) => `<w:p><w:r><w:t xml:space="preserve">${xml(line)}</w:t></w:r></w:p>`).join("")
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  return zip([
    { name: "[Content_Types].xml", data: Buffer.from(types) },
    { name: "_rels/.rels", data: Buffer.from(rels) },
    { name: "word/document.xml", data: Buffer.from(document) },
  ])
}

export function reportPdf(lines: string[]) {
  const wrapped: string[] = []
  for (const line of lines) {
    const safe = pdfEscape(line)
    if (!safe) {
      wrapped.push("")
      continue
    }
    for (let index = 0; index < safe.length; index += 90) wrapped.push(safe.slice(index, index + 90))
  }
  const visible = wrapped.slice(0, 48)
  const commands = ["BT", "/F1 11 Tf", "50 800 Td", "14 TL"]
  for (const line of visible) commands.push(`(${line}) Tj`, "T*")
  commands.push("ET")
  const stream = commands.join("\n")
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
    "2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n",
    `4 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream\nendobj\n`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n",
  ]
  let body = "%PDF-1.4\n"
  const xref = [0]
  for (const object of objects) {
    xref.push(Buffer.byteLength(body))
    body += object
  }
  const start = Buffer.byteLength(body)
  body += `xref\n0 ${xref.length}\n0000000000 65535 f \n`
  for (const pos of xref.slice(1)) body += `${String(pos).padStart(10, "0")} 00000 n \n`
  body += `trailer << /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`
  return Buffer.from(body)
}
