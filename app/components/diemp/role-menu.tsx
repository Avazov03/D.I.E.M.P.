"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import sidebaritems, { type MenuItem } from "@/app/(dashboard-layout)/layout/vertical/sidebar/sidebaritems"
import NavCollapse from "@/app/(dashboard-layout)/layout/vertical/sidebar/nav-collapse"
import { canOpen, type Role } from "@/lib/diemp/access"

type Session = { rol: Role }

function menuFor(rol: Role): MenuItem[] {
  const menu = sidebaritems
    .map((section) => ({
      ...section,
      items: section.items?.filter((item) => !item.url || canOpen(rol, item.url)),
    }))
    .filter((section) => section.items && section.items.length > 0)

  if (rol === "super_admin") {
    menu.push({
      heading: "Boshqaruv",
      items: [{ id: "users", name: "Foydalanuvchilar", icon: Users, url: "/foydalanuvchilar" }],
    })
  }
  return menu
}

export function RoleMenu({ className }: { className?: string }) {
  const [rol, setRol] = useState<Role | null>(null)

  useEffect(() => {
    void fetch("/api/sessiya")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: Session | null) => setRol(data?.rol ?? null))
  }, [])

  if (!rol) return null
  return <NavCollapse menu={menuFor(rol)} className={className} />
}
