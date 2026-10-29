"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { organizations } from "@/lib/diemp/sample"
import type { Draft, DraftTask } from "@/lib/diemp/draft"
import { cn } from "@/lib/utils"

const orgCodes = new Set<string>(organizations.map((item) => item.kod))
const openField = "border-[#2090F0]! bg-[#2090F0]/10! ring-2! ring-[#2090F0]/25!"

function guessOrg(value: string) {
  const text = value.toLowerCase()
  return organizations.find((item) => text.includes(item.kod) || text.includes(item.nom.toLowerCase().slice(0, 8)))?.kod ?? ""
}

export function DocumentReview({
  id,
  nom,
  tur,
  matn,
  holat,
  cheklov,
  draft,
}: {
  id: string
  nom: string
  tur: "pdf" | "docx"
  matn: string
  holat: string
  cheklov: string
  draft: Draft | null
}) {
  const [raqam, setRaqam] = useState(draft?.raqam ?? "")
  const [nomi, setNomi] = useState(draft?.nomi ?? nom)
  const [sana, setSana] = useState(draft?.sana ?? "")
  const [tasks, setTasks] = useState<DraftTask[]>(
    draft?.topshiriqlar.length
      ? draft.topshiriqlar.map((task) => ({ ...task, tashkilot: guessOrg(task.tashkilot) || task.tashkilot }))
      : [{ matn: "", muddat: "", tashkilot: "", parchasi: "" }],
  )
  const [note, setNote] = useState(holat === "tasdiqlangan" ? "Tasdiqlangan. Topshiriqlar ro'yxatiga yozildi." : "")
  const [loading, setLoading] = useState(false)
  const settled = holat === "tasdiqlangan" || note.startsWith("Tasdiqlandi")
  const openOrg = (value: string) => orgCodes.has(guessOrg(value) || value)
  const gaps = settled ? [] : [
    !raqam.trim() ? "Qaror raqami" : "",
    !nomi.trim() ? "Nomi" : "",
    !sana.trim() ? "Sana" : "",
    ...tasks.flatMap((task, index) => [
      !task.matn.trim() ? `${index + 1}-topshiriq` : "",
      !task.muddat.trim() ? `${index + 1}-muddat` : "",
      !openOrg(task.tashkilot) ? `${index + 1}-tashkilot` : "",
    ]),
  ].filter(Boolean)

  function update(index: number, key: keyof DraftTask, value: string) {
    setTasks((current) => current.map((task, item) => (item === index ? { ...task, [key]: value } : task)))
  }

  async function confirm() {
    setLoading(true)
    setNote("")
    try {
      const response = await fetch(`/api/hujjat/${id}/tasdiq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raqam, nomi, sana, topshiriqlar: tasks }),
      })
      const data = (await response.json()) as { xato?: string; raqam?: string }
      if (!response.ok) {
        setNote(data.xato || "Tasdiqlanmadi")
        return
      }
      setNote("Tasdiqlandi. Topshiriqlar ro'yxatida manbasi Hujjat deb turadi.")
    } catch {
      setNote("Tasdiqlanmadi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl">{nom}</h2>
          <p className="text-sm text-muted-foreground">{cheklov || "Chapda hujjat matni, o'ngda ajratilgan maydonlar. Tasdiq odamniki."}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <a className="underline underline-offset-4" href={`/api/hujjat/${id}/fayl`} target="_blank" rel="noreferrer">Asl faylni ochish</a>
          <Link className="underline underline-offset-4" href="/hujjatlar">Ro'yxat</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="border border-border p-4">
          <h3 className="mb-3 text-sm font-medium">Hujjat matni{tur === "pdf" ? "" : ""}</h3>
          {tur === "pdf" ? (
            <iframe title="Asl PDF" src={`/api/hujjat/${id}/fayl`} className="mb-4 h-80 w-full border border-border" />
          ) : null}
          <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap text-sm text-foreground">{matn}</pre>
        </section>
        <section className="flex flex-col gap-3 border border-border p-4">
          <h3 className="text-sm font-medium">Ajratilgan maydonlar</h3>
          {gaps.length ? <p className="text-sm text-muted-foreground">Rangli katakni siz to&apos;ldirasiz.</p> : null}
          <label className="flex flex-col gap-1 text-sm">Qaror raqami
            <Input className={cn(!settled && !raqam.trim() && openField)} value={raqam} onChange={(event) => setRaqam(event.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">Nomi
            <Input className={cn(!settled && !nomi.trim() && openField)} value={nomi} onChange={(event) => setNomi(event.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">Sana
            <Input className={cn(!settled && !sana.trim() && openField)} value={sana} onChange={(event) => setSana(event.target.value)} placeholder="Sanani yozing" />
          </label>
          {draft?.aniqlanmagan?.length ? <p className="text-sm text-muted-foreground">Aniqlanmagan: {draft.aniqlanmagan.join(", ")}</p> : null}
          {tasks.map((task, index) => {
            const orgOpen = !settled && !openOrg(task.tashkilot)
            const textOpen = !settled && !task.matn.trim()
            const dateOpen = !settled && !task.muddat.trim()
            return (
            <div key={index} className="flex flex-col gap-2 border border-border p-3">
              <Textarea className={cn(textOpen && openField)} value={task.matn} onChange={(event) => update(index, "matn", event.target.value)} placeholder="Topshiriq matni" />
              <Input className={cn(dateOpen && openField)} value={task.muddat} onChange={(event) => update(index, "muddat", event.target.value)} placeholder="Muddat" />
              <select className={cn("h-9 border bg-background px-2 text-sm", orgOpen ? openField : "border-border")} value={guessOrg(task.tashkilot) || (orgCodes.has(task.tashkilot) ? task.tashkilot : "")} onChange={(event) => update(index, "tashkilot", event.target.value)}>
                <option value="">Tashkilotni tanlang</option>
                {organizations.map((item) => <option key={item.kod} value={item.kod}>{item.nom}</option>)}
              </select>
              {task.parchasi ? <p className="text-xs text-muted-foreground">Manba parchasi: {task.parchasi}</p> : null}
            </div>
            )
          })}
          <Button type="button" variant="secondary" onClick={() => setTasks((current) => [...current, { matn: "", muddat: "", tashkilot: "", parchasi: "" }])}>Topshiriq qo'shish</Button>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">{note}</p>
            <Button type="button" disabled={loading} onClick={() => void confirm()}>{loading ? "Saqlanmoqda" : "Tasdiqlash"}</Button>
          </div>
          {note.startsWith("Tasdiqlandi") ? <Link className="text-sm underline underline-offset-4" href="/topshiriqlar">Topshiriqlar ro'yxati</Link> : null}
        </section>
      </div>
    </div>
  )
}
