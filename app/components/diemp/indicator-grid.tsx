"use client"

import Link from "next/link"
import { Gauge, Landmark, ShieldCheck, Timer, type LucideIcon } from "lucide-react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { averageBurden, averageNet, averageOutcome, countStatus, visibleAssessments } from "@/lib/diemp/ttb"

const net = averageNet()
const burden = averageBurden()
const outcome = averageOutcome()
const confirmed = countStatus("tasdiqlangan") + countStatus("monitoring")
const total = visibleAssessments().length
const confirmRate = total ? Math.round((confirmed / total) * 100) : null

const cells: { href: string; title: string; value: number | null; suffix: string; hint: string; icon: LucideIcon }[] = [
  { href: "/baholash", title: "O'rtacha sof ta'sir", value: net, suffix: "", hint: "Tasdiqlangan foyda − xarajat", icon: Gauge },
  { href: "/baholash", title: "Ma'muriy yuk", value: burden, suffix: "", hint: "Tasdiqlangan yuk ballari o'rtachasi", icon: Landmark },
  { href: "/monitoring", title: "Reja bajarilishi", value: outcome, suffix: "%", hint: "Haqiqiy / reja, faqat tasdiqlangan", icon: Timer },
  { href: "/hisobotlar?holat=tasdiqlangan", title: "Tasdiq ulushi", value: confirmRate, suffix: "%", hint: `${confirmed} / ${total} baholash`, icon: ShieldCheck },
]

function RateRing({ value, label, max = 100 }: { value: number | null; label: string; max?: number }) {
  const amount = value === null ? 0 : Math.min(100, Math.round((value / max) * 100))
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
                  <h6 className="text-2xl font-semibold">{cell.value === null ? "—" : `${cell.value}${cell.suffix}`}</h6>
                  <p className="text-sm font-normal">{cell.title}</p>
                  <p className="text-xs text-muted-foreground">{cell.hint}</p>
                </div>
              </div>
              <RateRing value={cell.value} label={cell.title} max={cell.title.includes("sof") ? 400 : 100} />
            </Link>
          ))}
        </div>
      </CardContent>
    </DashboardCard>
  )
}
