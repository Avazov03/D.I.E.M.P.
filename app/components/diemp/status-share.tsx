"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import type { StatusKey } from "@/lib/diemp/charts"

const meta: Record<StatusKey, { label: string; href: string; swatch: string }> = {
  yakunlangan: { label: "Tasdiqlangan yakun", href: "/topshiriqlar?holat=yakunlangan", swatch: "bg-chart-1" },
  ijroda: { label: "Ijroda", href: "/topshiriqlar?holat=ijroda", swatch: "bg-chart-2" },
  muddati_otgan: { label: "Muddati o'tgan", href: "/topshiriqlar?holat=muddati_otgan", swatch: "bg-chart-3" },
}

const chartConfig = {
  yakunlangan: { label: "Tasdiqlangan yakun", color: "var(--color-chart-1)" },
  ijroda: { label: "Ijroda", color: "var(--color-chart-2)" },
  muddati_otgan: { label: "Muddati o'tgan", color: "var(--color-chart-3)" },
} satisfies ChartConfig

export function StatusShare({ total, parts }: { total: number; parts: { key: StatusKey; count: number; percent: number | null }[] }) {
  const router = useRouter()
  const row = { name: "Holat", yakunlangan: 0, ijroda: 0, muddati_otgan: 0 }
  for (const part of parts) row[part.key] = part.count

  return (
    <DashboardCard className="flex flex-col justify-between gap-3 overflow-visible!">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Holat taqsimoti</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-4 overflow-visible!">
        <div className="flex flex-col gap-1.5">
          <Link href="/topshiriqlar" className="text-2xl font-semibold">{total}</Link>
          <p className="text-xs font-normal text-muted-foreground">Shu roldagi topshiriqlar. Uch holat alohida hisoblanadi.</p>
        </div>
        {total === 0 ? <p className="text-sm text-muted-foreground">Hisoblanmaydi</p> : (
          <ChartContainer config={chartConfig} className="h-8! [&_.recharts-wrapper]:overflow-visible!">
            <BarChart data={[row]} layout="vertical" stackOffset="expand">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="yakunlangan" stackId="a" fill="var(--color-yakunlangan)" radius={[5, 5, 5, 5]} strokeWidth={2} stroke="var(--color-background)" className="cursor-pointer" onClick={() => router.push(meta.yakunlangan.href)} />
              <Bar dataKey="ijroda" stackId="a" fill="var(--color-ijroda)" stroke="var(--color-background)" radius={[5, 5, 5, 5]} className="cursor-pointer" onClick={() => router.push(meta.ijroda.href)} />
              <Bar dataKey="muddati_otgan" stackId="a" fill="var(--color-muddati_otgan)" stroke="var(--color-background)" radius={[5, 5, 5, 5]} className="cursor-pointer" onClick={() => router.push(meta.muddati_otgan.href)} />
            </BarChart>
          </ChartContainer>
        )}
        <div className="flex flex-col">
          {parts.map((part) => (
            <Link key={part.key} href={meta[part.key].href} className="py-4 border-b border-border last:border-b-0 flex items-center justify-between last:pb-0 hover:bg-muted/30">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${meta[part.key].swatch}`} />
                <span className="text-sm font-normal">{meta[part.key].label}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-sm font-medium">{part.count}</span>
                <span className="text-xs font-normal text-muted-foreground">{part.percent === null ? "(—)" : `(${part.percent}%)`}</span>
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </DashboardCard>
  )
}
