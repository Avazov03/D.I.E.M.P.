"use client"

import Link from "next/link"
import { PieChart } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { DashboardCard } from "@/app/components/shared/dashboard-card"

const meta = {
  tasdiqlangan: { label: "Tasdiqlangan", href: "/baholash?holat=tasdiqlangan", color: "var(--color-chart-1)" },
  tekshiruvda: { label: "Tekshiruvda", href: "/baholash?holat=tekshiruvda", color: "var(--color-chart-2)" },
  qoralama: { label: "Qoralama / qaytarilgan", href: "/baholash?holat=qoralama", color: "var(--color-chart-3)" },
} as const

type Key = keyof typeof meta

export function StatusShare({
  total,
  parts,
}: {
  total: number
  parts: { key: string; count: number; percent: number | null }[]
}) {
  const config = {
    tasdiqlangan: { label: meta.tasdiqlangan.label, color: "var(--color-chart-1)" },
    tekshiruvda: { label: meta.tekshiruvda.label, color: "var(--color-chart-2)" },
    qoralama: { label: meta.qoralama.label, color: "var(--color-chart-3)" },
  } satisfies ChartConfig

  const row = Object.fromEntries(parts.map((part) => [part.key, part.count])) as Record<string, number>
  const data = [{ nom: "holat", ...row }]

  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <PieChart size={16} className="text-muted-foreground" />
          Holat taqsimoti
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Shu roldagi baholashlar. Uch holat alohida hisoblanadi.</p>
          <Link href="/baholash" className="text-2xl font-semibold">{total}</Link>
        </div>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">Hisoblanmaydi</p>
        ) : (
          <ChartContainer config={config} className="aspect-auto! h-8 w-full">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }} stackOffset="expand">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="nom" hide />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              {(Object.keys(meta) as Key[]).map((key) => (
                <Bar key={key} dataKey={key} stackId="a" fill={meta[key].color} stroke="var(--color-background)" strokeWidth={2} className="cursor-pointer" onClick={() => { window.location.href = meta[key].href }} />
              ))}
            </BarChart>
          </ChartContainer>
        )}
        <div>
          {parts.map((part) => {
            const item = meta[part.key as Key]
            if (!item) return null
            return (
              <Link key={part.key} href={item.href} className="py-4 border-b border-border last:border-b-0 flex items-center justify-between last:pb-0 hover:bg-muted/30">
                <span className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-sm" style={{ background: item.color }} />
                  {item.label}
                </span>
                <span className="text-sm font-medium">{part.count}{part.percent === null ? "" : ` (${part.percent}%)`}</span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </DashboardCard>
  )
}
