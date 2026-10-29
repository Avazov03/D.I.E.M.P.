"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { DecisionView } from "@/lib/diemp/stat-math"

const chartConfig = {
  miqdor: { label: "Ta'sir", color: "var(--color-primary)" },
} satisfies ChartConfig

export function DecisionImpacts({
  decisions,
  canJudge,
}: {
  decisions: DecisionView[]
  canJudge: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState("")

  async function send(url: string, method: "POST" | "PATCH", body?: object) {
    setBusy(url)
    setNote("")
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = (await response.json()) as { xato?: string; soni?: number }
      if (!response.ok) {
        setNote(data.xato || "Saqlanmadi")
        return
      }
      setNote(typeof data.soni === "number" ? (data.soni ? "Statistika aniqlandi." : "Matnda aniq son chiqmadi. Diagramma o'zgarmaydi.") : "Saqlandi.")
      router.refresh()
    } catch {
      setNote("Aloqa uzildi")
    } finally {
      setBusy("")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl">Qaror ta&apos;siri</h2>
        <p className="text-sm text-muted-foreground">Qaror qatorini bosing. Pastda qaysi statistikaga, qanday va qancha teggani ochiladi.</p>
      </div>
      {note ? <p className="text-sm">{note}</p> : null}
      <div className="border border-border">
        {decisions.length === 0 ? <p className="p-4 text-sm text-muted-foreground">Hali qaror yo&apos;q.</p> : null}
        {decisions.map((decision) => {
          const shown = open === decision.raqam
          return (
            <div key={decision.raqam} className="border-b border-border last:border-b-0">
              <button
                type="button"
                className="flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-3 text-left hover:bg-muted/30"
                onClick={() => setOpen(shown ? "" : decision.raqam)}
              >
                <span>
                  <span className="block text-sm font-medium">{decision.raqam}</span>
                  <span className="block text-sm text-muted-foreground">{decision.nomi}</span>
                </span>
                <span className="text-sm text-muted-foreground">{decision.tasirlar.length ? `${decision.tasirlar.length} ta statistika` : "Hali bog'lanmagan"}</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${shown ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-4 border-t border-border p-4">
                    {decision.tasirlar.length === 0 ? <p className="text-sm text-muted-foreground">Bu qaror hali statistikaga yozilmagan.</p> : null}
                    {decision.tasirlar.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 gap-3 border border-border p-3 lg:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium">{item.nomi}</p>
                          <p className="text-2xl font-semibold">{item.matn}</p>
                          <p className="text-sm text-muted-foreground">{item.holat === "tasdiqlangan" ? "Ekspert tasdiqlagan. Joriy songa kirgan." : "Taklif. Joriy songa kirmaydi."}</p>
                          {item.parchasi ? <p className="text-sm">{item.parchasi}</p> : null}
                          {canJudge && item.holat === "taklif" ? (
                            <div className="flex gap-2">
                              <Button type="button" disabled={busy !== ""} onClick={() => send(`/api/tasir/${item.id}`, "PATCH", { holat: "tasdiqlangan" })}>Statistikaga qo&apos;shish</Button>
                              <Button type="button" variant="outline" disabled={busy !== ""} onClick={() => send(`/api/tasir/${item.id}`, "PATCH", { holat: "rad" })}>Rad etish</Button>
                            </div>
                          ) : null}
                        </div>
                        <ChartContainer config={chartConfig} className="aspect-auto h-[140px] w-full">
                          <BarChart data={[{ nom: item.nomi, miqdor: item.miqdor }]} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                            <XAxis dataKey="nom" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="miqdor" fill="var(--color-miqdor)" />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    ))}
                    <Button type="button" variant="outline" disabled={busy !== ""} onClick={() => send(`/api/qaror/${encodeURIComponent(decision.raqam)}/tasir`, "POST")}>
                      {busy.endsWith("/tasir") ? "Aniqlanmoqda" : "Qaysi statistikaga tegishini aniqlash"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
