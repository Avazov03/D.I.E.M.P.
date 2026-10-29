"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { closedChange, sliceSeries, type MonthPoint, type Period } from "@/lib/diemp/charts"

const chartConfig = {
  yopilgan: { label: "Tasdiqlangan baholash", color: "var(--color-primary)" },
  otgan: { label: "Qoralama / qaytarilgan", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig

const periods = [
  { value: "10", label: "So'nggi 10 oy" },
  { value: "3", label: "So'nggi 3 oy" },
  { value: "1", label: "Joriy oy" },
] as const

export function ExecutionChart({ series }: { series: MonthPoint[] }) {
  const router = useRouter()
  const [period, setPeriod] = useState<Period>("10")
  const data = sliceSeries(series, period)
  const closed = data.reduce((sum, point) => sum + point.yopilgan, 0)
  const change = closedChange(data)
  const peak = Math.max(1, ...data.flatMap((point) => [point.yopilgan, point.otgan]))
  const mark = data.reduce((best, point) => (point.otgan > best.otgan ? point : best), data[0])
  const periodLabel = periods.find((item) => item.value === period)?.label

  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={16} className="text-muted-foreground" />
          Baholash dinamikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-base font-normal text-foreground leading-6">Tasdiqlangan baholash</span>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/baholash?holat=tasdiqlangan" className="text-2xl font-semibold tracking-[-0.3px] text-foreground leading-8">
                {closed}
              </Link>
              {change === null ? <span className="text-sm text-muted-foreground">Oldingi oyga nisbatan hisoblanmaydi</span> : <span className="text-sm font-medium text-chart-2">{change > 0 ? `+${change}%` : `${change}%`} oldingi oyga nisbatan</span>}
            </div>
          </div>
          <Select value={period} onValueChange={(value) => value && setPeriod(value as Period)}>
            <SelectTrigger className="h-auto! w-fit text-sm font-medium text-foreground border-border shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer gap-1.5 px-3">
              <SelectValue>{periodLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {periods.map((item) => (
                <SelectItem key={item.value} value={item.value} className="cursor-pointer">{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[215px] w-full">
          <LineChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -10 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
            <XAxis dataKey="oy" tickLine={false} axisLine={false} tickMargin={10} interval={0} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={4} domain={[0, peak]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} width={32} />
            <ChartTooltip cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }} content={<ChartTooltipContent />} />
            {mark && mark.otgan > 0 ? <ReferenceLine x={mark.oy} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 4" /> : null}
            <Line dataKey="yopilgan" type="linear" stroke="var(--color-yopilgan)" strokeWidth={1.5} dot={false} activeDot={{ r: 4, fill: "var(--color-yopilgan)", strokeWidth: 0 }} className="cursor-pointer" onClick={() => router.push("/baholash?holat=tasdiqlangan")} />
            <Line dataKey="otgan" type="linear" stroke="var(--color-otgan)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} activeDot={{ r: 4, fill: "var(--color-otgan)", strokeWidth: 0 }} className="cursor-pointer" onClick={() => router.push("/baholash?holat=qoralama")} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </DashboardCard>
  )
}
