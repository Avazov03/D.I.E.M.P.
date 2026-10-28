import {
  ClipboardCheck,
  Files,
  FileText,
  Gauge,
  House,
  ListChecks,
  ScrollText,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

export interface ChildItem {
  id?: number | string
  name: string
  icon?: LucideIcon
  items?: ChildItem[]
  item?: unknown
  url?: string
  color?: string
  disabled?: boolean
  subtitle?: string
  badge?: boolean
  badgeType?: string
  badgeContent?: string
  isActive?: boolean
  external?: boolean
  isPro?: boolean
}

export interface MenuItem {
  heading?: string
  name?: string
  icon?: LucideIcon
  id?: number
  to?: string
  item?: MenuItem[]
  items?: ChildItem[]
  url?: string
  disabled?: boolean
  subtitle?: string
  badgeType?: string
  badge?: boolean
  badgeContent?: string
  isActive?: boolean
  isPro?: boolean
}

const SidebarContent: MenuItem[] = [
  {
    heading: "Nazorat",
    items: [
      { id: "dashboard", name: "Dashboard", icon: House, url: "/" },
      { id: "qarorlar", name: "Qarorlar", icon: FileText, url: "/qarorlar" },
      { id: "topshiriqlar", name: "Topshiriqlar", icon: ListChecks, url: "/topshiriqlar" },
      { id: "hisobotlar", name: "Hisobotlar", icon: ClipboardCheck, url: "/hisobotlar" },
      { id: "dalillar", name: "Dalillar", icon: Files, url: "/dalillar" },
    ],
  },
  {
    heading: "Tahlil",
    items: [
      { id: "kpi", name: "KPI", icon: Gauge, url: "/kpi" },
      { id: "xatarlar", name: "Xatarlar", icon: TriangleAlert, url: "/xatarlar" },
      { id: "tahlil", name: "AI tahlil", icon: Sparkles, url: "/tahlil" },
    ],
  },
  {
    heading: "Tizim",
    items: [
      { id: "audit", name: "Audit jurnali", icon: ScrollText, url: "/audit" },
    ],
  },
]

export default SidebarContent
