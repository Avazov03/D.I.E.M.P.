import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { UserCabinet } from "@/app/components/diemp/cabinets"
import { roleLabel, users } from "@/lib/diemp/access"
import { organizations } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Foydalanuvchilar" }

export default async function Page() {
  const user = await currentUser()
  if (!user || user.rol !== "super_admin") redirect("/")
  const rows = users.map((item) => ({
    pochta: item.pochta,
    rolNomi: roleLabel[item.rol],
    tashkilot: organizations.find((org) => org.kod === item.tashkilot)?.nom ?? "—",
  }))
  return <UserCabinet rows={rows} />
}
