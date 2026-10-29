import Link from "next/link"
import { CheckCheck, ClipboardList, FileText, FileWarning, Gauge, Hourglass, ListChecks, ScrollText } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { countStatus, visibleAssessments, visibleDocuments } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"

export async function ControlGrid() {
  const saved = await loadAssessments()
  const docs = visibleDocuments()
  const rows = visibleAssessments(saved)
  const cells = [
    { href: "/reyestr", title: "Reyestrdagi hujjatlar", value: docs.length, hint: "Loyiha va qabul qilingan", icon: ScrollText },
    { href: "/baholash", title: "Baholashlar", value: rows.length, hint: "Dastlabki va keyingi TTB", icon: ListChecks },
    { href: "/baholash?holat=tasdiqlangan", title: "Tasdiqlangan", value: countStatus("tasdiqlangan", saved) + countStatus("monitoring", saved), hint: "Ekspert tasdig'i bilan", icon: CheckCheck },
    { href: "/baholash?holat=tekshiruvda", title: "Tekshiruvda", value: countStatus("tekshiruvda", saved), hint: "Odam tasdig'i kutilmoqda", icon: ClipboardList },
    { href: "/baholash?holat=qoralama", title: "Qoralama", value: countStatus("qoralama", saved), hint: "Hali to'liq emas", icon: Hourglass },
    { href: "/hisobotlar?holat=kutilmoqda", title: "Hisobot kutilmoqda", value: countStatus("tekshiruvda", saved) + countStatus("qoralama", saved), hint: "Shakl hali yakunlanmagan", icon: FileWarning },
    { href: "/baholash?holat=qaytarilgan", title: "Qaytarilgan", value: countStatus("qaytarilgan", saved), hint: "Qayta ishlash kerak", icon: FileText },
    { href: "/monitoring", title: "Monitoringda", value: countStatus("monitoring", saved), hint: "Reja va haqiqiy solishtiriladi", icon: Gauge },
  ]
  return (
    <DashboardCard className="flex flex-col gap-0! pb-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList size={16} className="text-muted-foreground" />
          TTB kesimi
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full! px-0!">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {cells.map((cell) => (
            <Link key={cell.href + cell.title} href={cell.href} className="flex flex-col justify-between gap-6 p-6 bg-background hover:bg-muted/30">
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
