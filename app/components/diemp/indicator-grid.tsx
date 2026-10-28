"use client"

import Link from "next/link"
import { Gauge, Landmark, ShieldCheck, Timer, type LucideIcon } from "lucide-react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { averageApproved, deadlineRate, evidence, visibleTasks } from "@/lib/diemp/sample"

const rows = visibleTasks()
const physical = averageApproved(rows, "jismoniy", "jismoniyTasdiq")
const financial = averageApproved(rows, "moliyaviy", "moliyaviyTasdiq")
const deadline = deadlineRate(rows)
const approvedEvidence = evidence.filter((row) => row.holat === "tasdiqlangan" && row.maxfiylik !== "maxfiy").length
const visibleEvidence = evidence.filter((row) => row.maxfiylik !== "maxfiy").length
const evidenceRate = visibleEvidence ? Math.round((approvedEvidence / visibleEvidence) * 100) : null

const cells: { href: string; title: string; value: number | null; hint: string; icon: LucideIcon }[] = [
  { href: "/kpi", title: "Jismoniy bajarilish", value: physical, hint: "Tasdiqlangan hajmlar o'rtachasi", icon: Gauge },
  { href: "/kpi", title: "Moliyaviy bajarilish", value: financial, hint: "Jismoniy ko'rsatkichdan alohida", icon: Landmark },
  { href: "/topshiriqlar?muddatKod=otgan", title: "Muddatga rioya", value: deadline, hint: "Muddatida yopilgan / yopilgan yoki o'tgan", icon: Timer },
  { href: "/dalillar?holat=tasdiqlangan", title: "Dalil tasdig'i", value: evidenceRate, hint: `${approvedEvidence} / ${visibleEvidence} tasdiqlangan`, icon: ShieldCheck },
]

function RateRing({ value, label }: { value: number | null; label: string }) {
  const amount = value ?? 0
  const config = { qiymat: { label, color: "var(--color-primary)" } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className="aspect-auto! size-20! shrink-0">
      <RadialBarChart data={[{ qiymat: amount, fill: "var(--color-qiymat)" }]} startAngle={90} endAngle={-270} innerRadius="72%" outerRadius="100%">
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
        <RadialBar dataKey="qiymat" background cornerRadius={8} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
      </RadialBarChart>
    </ChartContainer>
  )
}

export function IndicatorGrid() {
  return (
    <DashboardCard className="flex flex-col gap-0! pb-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Gauge size={16} className="text-muted-foreground" />
          Alohida ko&apos;rsatkichlar
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full! px-0!">
        <div className="grid grid-cols-2 h-full gap-px bg-border">
          {cells.map((cell) => (
            <Link key={cell.title} href={cell.href} className="flex items-center justify-between gap-4 p-6 bg-background hover:bg-muted/30">
              <div className="flex flex-col gap-4">
                <div className="border border-border rounded-md p-2 w-fit">
                  <cell.icon width={16} height={16} />
                </div>
                <div>
                  <h6 className="text-2xl font-semibold">{cell.value === null ? "—" : `${cell.value}%`}</h6>
                  <p className="text-sm font-normal">{cell.title}</p>
                  <p className="text-xs text-muted-foreground">{cell.hint}</p>
                </div>
              </div>
              <RateRing value={cell.value} label={cell.title} />
            </Link>
          ))}
        </div>
      </CardContent>
    </DashboardCard>
  )
}
