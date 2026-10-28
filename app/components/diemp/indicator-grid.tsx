import Link from "next/link"
import { Gauge, Landmark, ShieldCheck, Timer } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { averageApproved, deadlineRate, evidence, visibleTasks } from "@/lib/diemp/sample"

const rows = visibleTasks()
const physical = averageApproved(rows, "jismoniy", "jismoniyTasdiq")
const financial = averageApproved(rows, "moliyaviy", "moliyaviyTasdiq")
const deadline = deadlineRate(rows)
const approvedEvidence = evidence.filter((row) => row.holat === "tasdiqlangan" && row.maxfiylik !== "maxfiy").length
const visibleEvidence = evidence.filter((row) => row.maxfiylik !== "maxfiy").length
const evidenceRate = visibleEvidence ? Math.round((approvedEvidence / visibleEvidence) * 100) : null

const cells = [
  { href: "/kpi", title: "Jismoniy bajarilish", value: physical === null ? "—" : `${physical}%`, hint: "Tasdiqlangan hajmlar o'rtachasi", icon: Gauge },
  { href: "/kpi", title: "Moliyaviy bajarilish", value: financial === null ? "—" : `${financial}%`, hint: "Jismoniy ko'rsatkichdan alohida", icon: Landmark },
  { href: "/topshiriqlar?muddatKod=otgan", title: "Muddatga rioya", value: deadline === null ? "—" : `${deadline}%`, hint: "Muddatida yopilgan / yopilgan yoki o'tgan", icon: Timer },
  { href: "/dalillar?holat=tasdiqlangan", title: "Dalil tasdig'i", value: evidenceRate === null ? "—" : `${evidenceRate}%`, hint: `${approvedEvidence} / ${visibleEvidence} tasdiqlangan`, icon: ShieldCheck },
]

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
            <Link key={cell.title} href={cell.href} className="flex flex-col justify-between gap-6 p-6 bg-background hover:bg-muted/30">
              <div className="border border-border rounded-md p-2 w-fit">
                <cell.icon width={16} height={16} />
              </div>
              <div>
                <h6 className="text-2xl font-semibold">{cell.value}</h6>
                <p className="text-sm font-normal">{cell.title}</p>
                <p className="text-xs text-muted-foreground">{cell.hint}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </DashboardCard>
  )
}
