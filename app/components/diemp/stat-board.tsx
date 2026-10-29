"use client"

import { useEffect, useRef, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartLine } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { formatSeriesDelta, formatSeriesValue } from "@/lib/diemp/stat-math"

export type StatCard = {
  id: string
  nomi: string
  manba: string
  havola: string
  yil: number
  chartBirlik: string
  qator: { yil: string; qiymat: number }[]
  joriy: string
  oldin: string
  tasdiq: string
  taklif: string
}

const chartConfig = {
  qiymat: { label: "Rasmiy qator", color: "var(--color-primary)" },
} satisfies ChartConfig

function StatChart({ card }: { card: StatCard }) {
  const box = useRef<HTMLDivElement>(null)
  const total = card.qator.length
  const [span, setSpan] = useState(total)
  const [end, setEnd] = useState(total)
  const [picked, setPicked] = useState(Math.max(0, total - 1))
  const spanRef = useRef(span)
  const endRef = useRef(end)
  spanRef.current = span
  endRef.current = end

  useEffect(() => {
    const node = box.current
    if (!node) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const speed = Math.min(5, Math.max(1, Math.round(Math.abs(event.deltaY) / 40)))
      const zoomIn = event.deltaY > 0
      const current = spanRef.current
      const edge = endRef.current
      if (zoomIn && current <= 3) {
        setEnd(Math.max(3, edge - speed))
        return
      }
      const nextSpan = zoomIn ? Math.max(3, current - speed) : Math.min(total, current + speed)
      setSpan(nextSpan)
      setEnd(Math.min(total, Math.max(nextSpan, edge)))
    }
    node.addEventListener("wheel", onWheel, { passive: false })
    return () => node.removeEventListener("wheel", onWheel)
  }, [total])

  const start = Math.max(0, end - span)
  const view = card.qator.slice(start, end)
  const values = view.map((point) => point.qiymat)
  const low = Math.min(...values)
  const high = Math.max(...values)
  const pad = Math.max((high - low) * 0.2, high * 0.01)
  const point = card.qator[Math.min(picked, total - 1)]
  const previous = card.qator[Math.min(picked, total - 1) - 1]
  const chosen = point
    ? previous
      ? `${point.yil}: ${formatSeriesValue(card.id, point.qiymat)}. ${previous.yil} dan ${formatSeriesDelta(card.id, point.qiymat - previous.qiymat)}.`
      : `${point.yil}: ${formatSeriesValue(card.id, point.qiymat)}.`
    : ""

  return (
    <>
      <div ref={box}>
        <ChartContainer config={chartConfig} className="aspect-auto! h-[180px]! w-full">
          <LineChart
            data={view}
            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
            onClick={(state) => {
              const year = state?.activeLabel
              const index = card.qator.findIndex((item) => item.yil === year)
              if (index >= 0) setPicked(index)
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
            <XAxis dataKey="yil" tickLine={false} axisLine={false} tickMargin={8} interval={view.length > 8 ? 2 : 0} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
            <YAxis domain={[low - pad, high + pad]} allowDataOverflow tickLine={false} axisLine={false} width={56} tickFormatter={(value) => new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(Number(value))} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatSeriesValue(card.id, Number(value))} />} />
            <Line dataKey="qiymat" type="linear" stroke="var(--color-qiymat)" strokeWidth={1.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          </LineChart>
        </ChartContainer>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm">{chosen}</p>
        <p className="text-xs text-muted-foreground">
          {span < total ? `Yillar ${view[0]?.yil}–${view[view.length - 1]?.yil}. ` : ""}
          G&apos;ildirak yil oralig&apos;ini yaqinlashtiradi. Nuqtani bosing. Manba yillik: oy va kun rasmiy qatorda yo&apos;q.
          {span < total ? (
            <button type="button" className="ml-2 underline underline-offset-4" onClick={() => { setSpan(total); setEnd(total) }}>Barcha yillar</button>
          ) : null}
        </p>
      </div>
    </>
  )
}

export function StatBoard({ cards }: { cards: StatCard[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">Statistika</h2>
        <p className="text-sm text-muted-foreground">Boshlang&apos;ich raqam Stat.uz dan. Rasmiy joriy son faqat ekspert tasdiqlagan ishdan siljiydi.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <DashboardCard key={card.id} className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <ChartLine size={16} className="text-muted-foreground" />
                {card.nomi}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-5">
              <div>
                <p className="text-2xl font-semibold tracking-[-0.3px]">{card.joriy}</p>
                <p className="text-sm text-muted-foreground">Oldin {card.oldin}. Qo&apos;shilgan: {card.tasdiq}.</p>
                {card.taklif ? <p className="text-sm text-muted-foreground">Taklif, hisobga kirmaydi: {card.taklif}</p> : null}
              </div>
              <StatChart card={card} />
              <a className="text-xs text-muted-foreground underline underline-offset-4" href={card.havola} target="_blank" rel="noreferrer">
                {card.manba}. Diagramma o&apos;lchovi: {card.chartBirlik}.
              </a>
            </CardContent>
          </DashboardCard>
        ))}
      </div>
    </div>
  )
}
