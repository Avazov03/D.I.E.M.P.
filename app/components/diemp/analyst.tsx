import Link from "next/link"
import { Sparkles } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/app/components/shared/dashboard-card"

const questions = [
  { savol: "Qaysi topshiriqlar muddati bo'yicha xavf ostida?", href: "/xatarlar?daraja=yuqori" },
  { savol: "Qaysi hisobotlar hali tasdiqlanmagan?", href: "/hisobotlar?holat=kutilmoqda" },
  { savol: "Qaysi dalillar yetishmayapti?", href: "/dalillar?holat=yetishmaydi" },
  { savol: "Qaysi KPI rasmiy natija bermaydi?", href: "/kpi?holat=hisoblanmaydi" },
  { savol: "Reja va moliyaviy ijro qayerda ajralib turadi?", href: "/kpi" },
]

export function AnalystPanel() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">AI tahlil</h2>
        <p className="text-sm text-muted-foreground">
          Gemini hozircha ulanmagan. Savol javobi hisoblab chiqarilmaydi. Quyidagi kesimlar tasdiqlangan namuna yozuvlarga olib boradi.
        </p>
      </div>
      <DashboardCard>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={16} />
            Rahbar savollari
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul>
            {questions.map((item) => (
              <li key={item.href} className="border-b border-border last:border-b-0">
                <Link href={item.href} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/30">
                  <span className="text-sm">{item.savol}</span>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Manbani ochish</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </DashboardCard>
      <p className="text-sm text-muted-foreground">
        AI xulosasi rasmiy fakt emas. Ulanganidan keyin ham har bir javob manba, cheklov va inson ko&apos;rigi bilan chiqadi.
      </p>
    </div>
  )
}
