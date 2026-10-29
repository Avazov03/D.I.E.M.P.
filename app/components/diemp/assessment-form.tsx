"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StatusPill } from "@/app/components/diemp/status-pill"
import { netEffect, outcomeGap, organName, type Assessment } from "@/lib/diemp/ttb"
import type { DocumentItem } from "@/lib/diemp/ttb"

export function AssessmentForm({
  assessment,
  document,
  canEdit,
  canConfirm,
}: {
  assessment: Assessment
  document: DocumentItem
  canEdit: boolean
  canConfirm: boolean
}) {
  const [row, setRow] = useState(assessment)
  const [note, setNote] = useState("")

  function setField<K extends keyof Assessment>(key: K, value: Assessment[K]) {
    setRow((current) => ({ ...current, [key]: value }))
  }

  const sof = netEffect(row)
  const natija = outcomeGap(row)

  function save(next: Assessment["holat"]) {
    setRow((current) => ({ ...current, holat: next }))
    setNote(
      next === "tasdiqlangan"
        ? "Tasdiqlandi. AI xulosasi emas — ekspert qarori."
        : next === "qaytarilgan"
          ? "Qaytarildi. Baholovchi qayta to'ldiradi."
          : "Qoralama saqlandi. Rasmiy hisobotga hali kirmaydi.",
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl">{row.id}. {document.nomi}</h2>
          <p className="text-sm text-muted-foreground">
            {organName(document.organ)} · {document.raqam} · versiya {document.versiya}. Maydonlar namuna; tasdiqlangan uslubiyot kelgach shakl almashtiriladi.
          </p>
        </div>
        <StatusPill code={row.holat} field="holat" />
      </div>

      <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-4">
        <div className="bg-background p-4">
          <p className="text-lg font-semibold">{sof === null ? "Hisoblanmaydi" : sof}</p>
          <p className="text-xs text-muted-foreground">Sof ta&apos;sir (foyda − xarajat)</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-lg font-semibold">{row.yukTasdiq === "ha" ? row.yuk : "Hisoblanmaydi"}</p>
          <p className="text-xs text-muted-foreground">Ma&apos;muriy yuk</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-lg font-semibold">{natija === null ? "Hisoblanmaydi" : `${natija}%`}</p>
          <p className="text-xs text-muted-foreground">Reja bajarilishi</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-lg font-semibold"><StatusPill code={row.turi} field="turi" /></p>
          <p className="text-xs text-muted-foreground">Baholash turi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="flex flex-col gap-3 border border-border p-4">
          <h3 className="text-sm font-medium">1–2. Muammo va maqsad</h3>
          <label className="flex flex-col gap-1 text-sm">Muammo
            <Textarea disabled={!canEdit} value={row.muammo} onChange={(event) => setField("muammo", event.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">Tartibga solish maqsadi
            <Textarea disabled={!canEdit} value={row.maqsad} onChange={(event) => setField("maqsad", event.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">Muqobil yechimlar
            <Textarea disabled={!canEdit} value={row.muqobil} onChange={(event) => setField("muqobil", event.target.value)} />
          </label>
        </section>

        <section className="flex flex-col gap-3 border border-border p-4">
          <h3 className="text-sm font-medium">3. Ta&apos;sir guruhlari</h3>
          <label className="flex flex-col gap-1 text-sm">Tadbirkorlik
            <Textarea disabled={!canEdit} value={row.tadbirkor} onChange={(event) => setField("tadbirkor", event.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">Fuqarolar
            <Textarea disabled={!canEdit} value={row.fuqaro} onChange={(event) => setField("fuqaro", event.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">Davlat organlari
            <Textarea disabled={!canEdit} value={row.davlat} onChange={(event) => setField("davlat", event.target.value)} />
          </label>
        </section>

        <section className="flex flex-col gap-3 border border-border p-4">
          <h3 className="text-sm font-medium">4. Xarajat, foyda va yuk</h3>
          <p className="text-xs text-muted-foreground">Raqamlar faqat tasdiq bayrog&apos;i bilan rasmiy hisobga kiradi.</p>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex flex-col gap-1 text-sm">Xarajat
              <Input disabled={!canEdit} value={row.xarajat} onChange={(event) => setField("xarajat", event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">Foyda
              <Input disabled={!canEdit} value={row.foyda} onChange={(event) => setField("foyda", event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">Yuk
              <Input disabled={!canEdit} value={row.yuk} onChange={(event) => setField("yuk", event.target.value)} />
            </label>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" disabled={!canConfirm} checked={row.xarajatTasdiq === "ha"} onChange={(event) => setField("xarajatTasdiq", event.target.checked ? "ha" : "yoq")} />Xarajat tasdiq</label>
            <label className="flex items-center gap-2"><input type="checkbox" disabled={!canConfirm} checked={row.foydaTasdiq === "ha"} onChange={(event) => setField("foydaTasdiq", event.target.checked ? "ha" : "yoq")} />Foyda tasdiq</label>
            <label className="flex items-center gap-2"><input type="checkbox" disabled={!canConfirm} checked={row.yukTasdiq === "ha"} onChange={(event) => setField("yukTasdiq", event.target.checked ? "ha" : "yoq")} />Yuk tasdiq</label>
          </div>
        </section>

        <section className="flex flex-col gap-3 border border-border p-4">
          <h3 className="text-sm font-medium">5. Monitoring</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm">Reja
              <Input disabled={!canEdit} value={row.reja} onChange={(event) => setField("reja", event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">Haqiqiy
              <Input disabled={!canEdit} value={row.haqiqiy} onChange={(event) => setField("haqiqiy", event.target.value)} />
            </label>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" disabled={!canConfirm} checked={row.rejaTasdiq === "ha"} onChange={(event) => setField("rejaTasdiq", event.target.checked ? "ha" : "yoq")} />Reja tasdiq</label>
            <label className="flex items-center gap-2"><input type="checkbox" disabled={!canConfirm} checked={row.haqiqiyTasdiq === "ha"} onChange={(event) => setField("haqiqiyTasdiq", event.target.checked ? "ha" : "yoq")} />Haqiqiy tasdiq</label>
          </div>
          <p className="text-sm text-muted-foreground">Hisobot Word/PDF uchun shakl uslubiyotdan olinadi. Hozircha namuna ko&apos;rinish.</p>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground">{note}</p>
        <div className="flex flex-wrap gap-2">
          <Link className="text-sm underline underline-offset-4 self-center" href="/baholash">Ro&apos;yxat</Link>
          <Link className="text-sm underline underline-offset-4 self-center" href="/hisobotlar">Hisobotlar</Link>
          {canEdit ? <Button type="button" variant="secondary" onClick={() => save("qoralama")}>Qoralama saqlash</Button> : null}
          {canConfirm ? <Button type="button" variant="secondary" onClick={() => save("qaytarilgan")}>Qaytarish</Button> : null}
          {canConfirm ? <Button type="button" onClick={() => save("tasdiqlangan")}>Ekspert tasdiqlasin</Button> : null}
        </div>
      </div>
    </div>
  )
}
