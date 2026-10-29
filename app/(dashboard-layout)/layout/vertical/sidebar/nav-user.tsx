"use client"

import { useEffect, useState } from "react"
import { ScrollText, Sparkles } from "lucide-react"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroupContent, SidebarGroup } from "@/components/ui/sidebar"
import Link from "next/link"
import { canOpen, type Role } from "@/lib/diemp/access"

export function NavUser() {
  const [rol, setRol] = useState<Role | null>(null)
  useEffect(() => {
    void fetch("/api/sessiya")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { rol?: Role } | null) => setRol(data?.rol ?? null))
  }, [])
  const navItems = [
    { title: "AI yordamchi", url: "/tahlil", icon: Sparkles },
    { title: "Audit jurnali", url: "/audit", icon: ScrollText },
  ].filter((item) => rol && canOpen(rol, item.url))

  return (
    <SidebarGroup className="mt-auto p-0">
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton size="lg" className="h-full cursor-pointer">
                <Link href={item.url}>
                  <div className="flex items-center gap-3 w-full">
                    <item.icon className="shadow-none size-5 shrink-0" />
                    <div className="flex flex-col flex-1 text-left text-sm leading-tight hide-menu whitespace-nowrap">
                      <span className="truncate font-medium">{item.title}</span>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
