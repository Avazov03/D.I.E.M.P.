"use client"

import { useState } from "react"
import { Box } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { executionSeries } from "@/lib/diemp/sample"

const chartConfig = {
  yopilgan: { label: "Tasdiqlangan yakun", color: "var(--color-primary)" },
  otgan: { label: "Muddati o'tgan", color: "color-mix(in srgb, var(--primary) 60%, transparent)" },
} satisfies ChartConfig

const periods = [
  { value: "10", label: "So'nggi 10 oy" },
  { value: "3", label: "So'nggi 3 oy" },
  { value: "1", label: "Joriy oy" },
] as const

export function ExecutionChart() {
  const [period, setPeriod] = useState<(typeof periods)[number]["value"]>("10")
  const data = executionSeries(period)
  const periodLabel = periods.find((item) => item.value === period)?.label

  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Box size={16} className="text-muted-foreground" />
          Ijro dinamikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-base font-normal text-foreground leading-6">Oy kesimida topshiriqlar</span>
            <span className="text-sm font-normal text-muted-foreground">Ikki chiziq birlashtirilmaydi: yakun va kechikish alohida.</span>
          </div>
          <Select value={period} onValueChange={(value) => value && setPeriod(value as typeof period)}>
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
        <ChartContainer config={chartConfig} className="h-[215px]! w-full">
          <LineChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -10 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
            <XAxis dataKey="oy" tickLine={false} axisLine={false} tickMargin={10} interval={0} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={4} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="yopilgan" type="linear" stroke="var(--color-yopilgan)" strokeWidth={1.5} dot={{ r: 3, fill: "var(--color-yopilgan)", strokeWidth: 0 }} />
            <Line dataKey="otgan" type="linear" stroke="var(--color-otgan)" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3, fill: "var(--color-otgan)", strokeWidth: 0 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </DashboardCard>
  )
}
