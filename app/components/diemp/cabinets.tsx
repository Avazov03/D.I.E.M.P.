"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { Registry } from "@/app/components/diemp/registry"
import { StatusPill } from "@/app/components/diemp/status-pill"
import { taskColumns, taskFilters, type DataRow } from "@/lib/diemp/sample"
import { roleLabel, type Role } from "@/lib/diemp/access"

export function CabinetHeading({ rol, text }: { rol: Role; text: string }) {
  return (
    <div className="pb-4">
      <h2 className="text-xl">{roleLabel[rol]}</h2>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function TaskCabinet({
  rol,
  text,
  rows,
}: {
  rol: Role
  text: string
  rows: DataRow[]
}) {
  return (
    <>
      <CabinetHeading rol={rol} text={text} />
      <Registry title="Topshiriqlar" description={text} columns={taskColumns} rows={rows} filters={taskFilters} filename="diemp-topshiriqlar.csv" />
    </>
  )
}

export function ExecutorCabinet({ rows }: { rows: DataRow[] }) {
  const [topshiriq, setTopshiriq] = useState(rows[0]?.raqam ?? "")
  const [matn, setMatn] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  async function send() {
    setLoading(true)
    setNote("")
    try {
      const response = await fetch("/api/hisobot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topshiriq, matn }),
      })
      const data = (await response.json()) as { xato?: string; raqam?: string }
      if (!response.ok) {
        setNote(data.xato || "Yuborilmadi")
        return
      }
      setMatn("")
      setNote(`${data.raqam} tasdiq navbatiga qo'yildi. Bu rasmiy foizga hali kirmaydi.`)
    } catch {
      setNote("Yuborilmadi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CabinetHeading rol="ijrochi" text="Sizga biriktirilgan topshiriqlar. Hisobot tasdiqlanmaguncha rasmiy foizga kirmaydi." />
      <DashboardCard className="mb-4">
        <CardHeader className="border-b border-border">
          <CardTitle>Hisobot yuborish</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-6">
          <div className="flex flex-col gap-2">
            {rows.map((row) => (
              <label key={row.raqam} className="flex items-center justify-between gap-3 border border-border px-3 py-2 text-sm">
                <span className="flex items-center gap-3">
                  <input type="radio" name="topshiriq" checked={topshiriq === row.raqam} onChange={() => setTopshiriq(row.raqam)} />
                  <span>{row.raqam}. {row.matn}</span>
                </span>
                <StatusPill code={row.holat} field="holat" />
              </label>
            ))}
          </div>
          <Textarea value={matn} onChange={(event) => setMatn(event.target.value)} maxLength={300} placeholder="Bajarilgan ish va dalil haqida qisqa hisobot" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{note}</p>
            <Button type="button" disabled={loading || matn.trim().length < 5} onClick={() => void send()}>
              {loading ? "Yuborilmoqda" : "Hisobotni yuborish"}
            </Button>
          </div>
          <Link href="/hisobotlar" className="text-sm underline underline-offset-4">Hisobotlar ro'yxati</Link>
        </CardContent>
      </DashboardCard>
      <Registry title="Mening topshiriqlarim" description="Faqat sizga biriktirilgan bandlar." columns={taskColumns} rows={rows} filters={[]} filename="diemp-ijro.csv" />
    </>
  )
}

export function UserCabinet({ rows }: { rows: { pochta: string; rolNomi: string; tashkilot: string }[] }) {
  return (
    <>
      <CabinetHeading rol="super_admin" text="Foydalanuvchilar va rollar. Bu namuna ro'yxat, parol hammada bir xil: namuna." />
      <Registry
        title="Foydalanuvchilar"
        description="Super administrator ro'yxatni ko'radi. Yangi rol keyingi bosqichda bazaga yoziladi."
        columns={[
          { key: "pochta", label: "Pochta" },
          { key: "rolNomi", label: "Rol" },
          { key: "tashkilot", label: "Tashkilot" },
        ]}
        rows={rows}
        filters={[]}
        filename="diemp-foydalanuvchilar.csv"
      />
    </>
  )
}
