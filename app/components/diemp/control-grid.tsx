import Link from "next/link"
import { AlertTriangle, CheckCheck, ClipboardList, FileWarning, Files, Hourglass, ListChecks, ScrollText } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { countBy, decisions, evidence, reports, tasks, visibleTasks } from "@/lib/diemp/sample"

const openTasks = visibleTasks()

const cells = [
  { href: "/qarorlar", title: "Jami qarorlar", value: decisions.length, hint: "Bitta yozuv maxfiy toifada", icon: ScrollText },
  { href: "/topshiriqlar", title: "Jami topshiriqlar", value: openTasks.length, hint: "Maxfiy bandlar yashirilgan", icon: ListChecks },
  { href: "/topshiriqlar?holat=yakunlangan", title: "Tasdiqlangan yakun", value: countBy(openTasks, "holat", "yakunlangan"), hint: "Yakuniy tasdiq bilan", icon: CheckCheck },
  { href: "/topshiriqlar?holat=ijroda", title: "Ijrodagi", value: countBy(openTasks, "holat", "ijroda"), hint: "Hali yopilmagan", icon: ClipboardList },
  { href: "/topshiriqlar?holat=muddati_otgan", title: "Muddati o'tgan", value: countBy(openTasks, "holat", "muddati_otgan"), hint: "Qoidaviy kechikish", icon: Hourglass },
  { href: "/hisobotlar?holat=kutilmoqda", title: "Tasdiq kutilmoqda", value: countBy(reports, "holat", "kutilmoqda"), hint: "Rasmiy foizga kirmaydi", icon: FileWarning },
  { href: "/dalillar?holat=yetishmaydi", title: "Dalil yetishmaydi", value: countBy(evidence, "holat", "yetishmaydi"), hint: "Fayl borligi isbot emas", icon: Files },
  { href: "/xatarlar?daraja=yuqori", title: "Yuqori xatar", value: countBy(tasks.filter((row) => row.maxfiylik !== "maxfiy"), "xatar", "yuqori"), hint: "Qoida asosida ochilgan", icon: AlertTriangle },
]

export function ControlGrid() {
  return (
    <DashboardCard className="flex flex-col gap-0! pb-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList size={16} className="text-muted-foreground" />
          Nazorat kesimi
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full! px-0!">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {cells.map((cell) => (
            <Link key={cell.href} href={cell.href} className="flex flex-col justify-between gap-6 p-6 bg-background hover:bg-muted/30">
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
