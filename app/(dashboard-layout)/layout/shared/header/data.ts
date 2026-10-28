import { ClipboardCheck, FileWarning, ScrollText, ShieldAlert, type LucideIcon } from "lucide-react"

export interface NotificationType {
  title: string
  icon: LucideIcon
  subtitle: string
  bgcolor: string
  color: string
  time: string
  isRead?: boolean
}

const Notification: NotificationType[] = [
  {
    icon: FileWarning,
    bgcolor: "bg-chart-4/10",
    color: "text-chart-4",
    title: "Hisobot qaytarildi",
    subtitle: "HS-102 dalili topshiriqqa mos emas",
    time: "09:40",
    isRead: false,
  },
  {
    icon: ShieldAlert,
    bgcolor: "bg-destructive/10",
    color: "text-destructive",
    title: "Muddat buzildi",
    subtitle: "NM-03-01 qoidaviy xatar: yuqori",
    time: "09:10",
    isRead: false,
  },
  {
    icon: ClipboardCheck,
    bgcolor: "bg-chart-2/10",
    color: "text-chart-2",
    title: "Dalil tasdiqlandi",
    subtitle: "DL-07 xesh bo'yicha tekshirildi",
    time: "11:05",
    isRead: false,
  },
  {
    icon: ScrollText,
    bgcolor: "bg-primary/5",
    color: "text-primary",
    title: "Eksport rad etildi",
    subtitle: "NM-05 maxfiy toifada",
    time: "15:44",
    isRead: true,
  },
]

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
  { avatar: ShieldAlert, title: "Xatarlar", href: "/xatarlar", badge: false },
]

export { Notification, profileDD }
