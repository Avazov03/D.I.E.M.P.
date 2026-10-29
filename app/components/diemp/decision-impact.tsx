"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { DecisionView } from "@/lib/diemp/stat-math"

const chartConfig = {
  miqdor: { label: "Ta'sir", color: "var(--color-primary)" },
} satisfies ChartConfig

function impactDomain(value: number): [number, number] {
  const pad = Math.abs(value) * 0.25 || 1
  return [Math.min(0, value) - (value < 0 ? pad : 0), Math.max(0, value) + (value > 0 ? pad : 0)]
}

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
                  <div className="flex flex-col gap-3 border-t border-border bg-muted/20 p-3">
                    {decision.tasirlar.length === 0 ? <p className="text-sm text-muted-foreground">Bu qaror hali statistikaga yozilmagan.</p> : null}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {decision.tasirlar.map((item) => (
                        <div key={item.id} className="flex flex-col gap-2 border border-border bg-background p-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium">{item.nomi}</p>
                            <p className="shrink-0 text-xs text-muted-foreground">{item.holat === "tasdiqlangan" ? "Joriy songa kirgan" : "Taklif"}</p>
                          </div>
                          <p className="text-lg font-semibold tracking-tight">{item.matn}</p>
                          <ChartContainer config={chartConfig} className="aspect-auto! h-8! w-full">
                            <BarChart layout="vertical" data={[{ nom: item.nomi, miqdor: item.miqdor }]} margin={{ top: 6, right: 0, bottom: 6, left: 0 }}>
                              <XAxis type="number" domain={impactDomain(item.miqdor)} allowDataOverflow hide />
                              <YAxis type="category" dataKey="nom" hide width={0} />
                              <ReferenceLine x={0} stroke="var(--border)" />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="miqdor" fill="var(--color-miqdor)" barSize={8} />
                            </BarChart>
                          </ChartContainer>
                          {item.parchasi ? <p className="line-clamp-2 text-xs text-muted-foreground">{item.parchasi}</p> : null}
                          {canJudge && item.holat === "taklif" ? (
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" size="sm" disabled={busy !== ""} onClick={() => send(`/api/tasir/${item.id}`, "PATCH", { holat: "tasdiqlangan" })}>Statistikaga qo&apos;shish</Button>
                              <Button type="button" size="sm" variant="outline" disabled={busy !== ""} onClick={() => send(`/api/tasir/${item.id}`, "PATCH", { holat: "rad" })}>Rad etish</Button>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="w-fit" disabled={busy !== ""} onClick={() => send(`/api/qaror/${encodeURIComponent(decision.raqam)}/tasir`, "POST")}>
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
