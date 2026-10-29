"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartLine } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { DashboardCard } from "@/app/components/shared/dashboard-card"

export type StatCard = {
  id: string
  nomi: string
  manba: string
  havola: string
  yil: number
  chartBirlik: string
  qator: { yil: string; qiymat: number }[]
  joriy: string
  tasdiq: string
  taklif: string
}

const chartConfig = {
  qiymat: { label: "Rasmiy qator", color: "var(--color-primary)" },
} satisfies ChartConfig

export function StatBoard({ cards }: { cards: StatCard[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">Statistika</h2>
        <p className="text-sm text-muted-foreground">Boshlang&apos;ich raqam Stat.uz dan. Rasmiy joriy son faqat ekspert tasdiqlagan ishdan siljiydi.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {cards.map((card) => {
          const values = card.qator.map((point) => point.qiymat)
          const low = Math.min(...values)
          const high = Math.max(...values)
          const pad = Math.max((high - low) * 0.2, high * 0.01)
          return (
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
                <p className="text-sm text-muted-foreground">{card.tasdiq}</p>
                {card.taklif ? <p className="text-sm text-muted-foreground">Taklif, hisobga kirmaydi: {card.taklif}</p> : null}
              </div>
              <ChartContainer config={chartConfig} className="aspect-auto h-[180px] w-full">
                <LineChart data={card.qator} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis dataKey="yil" tickLine={false} axisLine={false} tickMargin={8} interval={2} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[low - pad, high + pad]} tickLine={false} axisLine={false} width={56} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="qiymat" type="linear" stroke="var(--color-qiymat)" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ChartContainer>
              <a className="text-xs text-muted-foreground underline underline-offset-4" href={card.havola} target="_blank" rel="noreferrer">
                {card.manba}. Diagramma o&apos;lchovi: {card.chartBirlik}.
              </a>
            </CardContent>
          </DashboardCard>
          )
        })}
      </div>
    </div>
  )
}
