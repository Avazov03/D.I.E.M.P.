import {
  ClipboardCheck,
  FileText,
  FileUp,
  Gauge,
  House,
  ListChecks,
  ScrollText,
  Sparkles,
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
    heading: "TTB jarayoni",
    items: [
      { id: "dashboard", name: "Dashboard", icon: House, url: "/" },
      { id: "hujjatlar", name: "Hujjat yuklash", icon: FileUp, url: "/hujjatlar" },
      { id: "reyestr", name: "Reyestr", icon: FileText, url: "/reyestr" },
      { id: "baholash", name: "Baholash", icon: ListChecks, url: "/baholash" },
      { id: "hisobotlar", name: "Hisobotlar", icon: ClipboardCheck, url: "/hisobotlar" },
      { id: "monitoring", name: "Monitoring", icon: Gauge, url: "/monitoring" },
    ],
  },
  {
    heading: "Tahlil",
    items: [
      { id: "tahlil", name: "AI yordamchi", icon: Sparkles, url: "/tahlil" },
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
