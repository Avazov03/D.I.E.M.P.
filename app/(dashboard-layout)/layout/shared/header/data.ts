import { ClipboardCheck, FileWarning, Gauge, ScrollText, ShieldAlert, type LucideIcon } from "lucide-react"

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
    title: "Baholash qaytarildi",
    subtitle: "BH-05 foyda hisobi tasdiqlanmadi",
    time: "09:40",
    isRead: false,
  },
  {
    icon: ShieldAlert,
    bgcolor: "bg-destructive/10",
    color: "text-destructive",
    title: "Tekshiruv kutilmoqda",
    subtitle: "BH-01 ekspert tasdig'iga navbatda",
    time: "09:10",
    isRead: false,
  },
  {
    icon: ClipboardCheck,
    bgcolor: "bg-chart-2/10",
    color: "text-chart-2",
    title: "Hisobot tasdiqlandi",
    subtitle: "BH-04 keyingi TTB yakunlandi",
    time: "11:05",
    isRead: false,
  },
  {
    icon: Gauge,
    bgcolor: "bg-primary/5",
    color: "text-primary",
    title: "Monitoring yangilandi",
    subtitle: "BH-02 haqiqiy 42 / reja 50",
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
  { avatar: ShieldAlert, title: "Monitoring", href: "/monitoring", badge: false },
]

export { Notification, profileDD }
