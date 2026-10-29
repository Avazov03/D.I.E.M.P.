export type Role = "super_admin" | "rahbariyat" | "nazorat" | "koordinator" | "ijrochi" | "tahlilchi"

export type User = {
  id: string
  pochta: string
  parol: string
  rol: Role
  ism: string
  tashkilot: string | null
  topshiriqlar: string[]
}

export const sessionCookie = "diemp_user"

export const roleLabel: Record<Role, string> = {
  super_admin: "Super administrator",
  rahbariyat: "Rahbariyat",
  nazorat: "Ekspert (tasdiqlovchi)",
  koordinator: "Organ koordinatori",
  ijrochi: "Baholovchi mutaxassis",
  tahlilchi: "Tahlilchi",
}

export const users: User[] = [
  { id: "admin", pochta: "admin@diemp.uz", parol: "namuna", rol: "super_admin", ism: "Super administrator", tashkilot: null, topshiriqlar: [] },
  { id: "rahbar", pochta: "rahbar@diemp.uz", parol: "namuna", rol: "rahbariyat", ism: "Rahbariyat", tashkilot: null, topshiriqlar: [] },
  { id: "nazorat", pochta: "nazorat@diemp.uz", parol: "namuna", rol: "nazorat", ism: "Ekspert", tashkilot: null, topshiriqlar: [] },
  { id: "iqtisod", pochta: "iqtisod@diemp.uz", parol: "namuna", rol: "koordinator", ism: "Organ koordinatori", tashkilot: "iqtisod", topshiriqlar: [] },
  { id: "ijro", pochta: "ijro@diemp.uz", parol: "namuna", rol: "ijrochi", ism: "Baholovchi mutaxassis", tashkilot: "qurilish", topshiriqlar: ["BH-02", "BH-03"] },
  { id: "tahlil", pochta: "tahlil@diemp.uz", parol: "namuna", rol: "tahlilchi", ism: "Tahlilchi", tashkilot: null, topshiriqlar: [] },
]

const grants: Record<Role, string[]> = {
  super_admin: ["*"],
  rahbariyat: ["/", "/hujjatlar", "/reyestr", "/baholash", "/hisobotlar", "/monitoring", "/tahlil", "/audit", "/qarorlar", "/topshiriqlar", "/kpi", "/xatarlar", "/dalillar"],
  nazorat: ["/", "/hujjatlar", "/reyestr", "/baholash", "/hisobotlar", "/monitoring", "/audit", "/qarorlar", "/topshiriqlar"],
  koordinator: ["/", "/reyestr", "/baholash", "/hisobotlar", "/hujjatlar", "/qarorlar", "/topshiriqlar"],
  ijrochi: ["/", "/baholash", "/hisobotlar", "/topshiriqlar"],
  tahlilchi: ["/", "/baholash", "/monitoring", "/tahlil", "/reyestr", "/kpi", "/xatarlar"],
}

export function findUser(pochta: string, parol: string) {
  const mail = pochta.trim().toLowerCase()
  return users.find((user) => user.pochta === mail && user.parol === parol) ?? null
}

export function userById(id: string | undefined) {
  return users.find((user) => user.id === id) ?? null
}

export function publicUser(user: User) {
  return { id: user.id, pochta: user.pochta, rol: user.rol, ism: user.ism, rolNomi: roleLabel[user.rol], tashkilot: user.tashkilot, topshiriqlar: user.topshiriqlar }
}

export function canOpen(rol: Role, pathname: string) {
  if (rol === "super_admin") return true
  return grants[rol].some((path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)))
}

export function canUpload(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "nazorat" || rol === "koordinator"
}

export function canEditAssessment(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "koordinator" || rol === "ijrochi"
}

export function canConfirmAssessment(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "nazorat"
}

export function canAskAi(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "tahlilchi"
}

export function canCheckEvidence(rol: Role) {
  return canAskAi(rol) || rol === "nazorat"
}

export function canJudgeEvidence(rol: Role) {
  return canConfirmAssessment(rol)
}
