import { ClipboardCheck, ScrollText, ShieldAlert, type LucideIcon } from "lucide-react"

export interface NotificationType {
  title: string
  icon: LucideIcon
  subtitle: string
  bgcolor: string
  color: string
  time: string
  isRead?: boolean
}

const Notification: NotificationType[] = []

interface profileType {
  avatar: LucideIcon
  title: string
  href: string
  badge: boolean
  isPro?: boolean
  external?: boolean
}

const profileDD: profileType[] = [
  { avatar: ScrollText, title: "Dashboard", href: "/", badge: false },
  { avatar: ClipboardCheck, title: "Hisobotlar", href: "/hisobotlar", badge: false },
  { avatar: ShieldAlert, title: "Monitoring", href: "/monitoring", badge: false },
]

export { Notification, profileDD }
