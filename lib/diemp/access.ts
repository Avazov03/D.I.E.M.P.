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
  nazorat: "Nazorat mas'uli",
  koordinator: "Tashkilot koordinatori",
  ijrochi: "Ijrochi",
  tahlilchi: "Tahlilchi",
}

export const users: User[] = [
  { id: "admin", pochta: "admin@diemp.uz", parol: "namuna", rol: "super_admin", ism: "Super administrator", tashkilot: null, topshiriqlar: [] },
  { id: "rahbar", pochta: "rahbar@diemp.uz", parol: "namuna", rol: "rahbariyat", ism: "Rahbariyat", tashkilot: null, topshiriqlar: [] },
  { id: "nazorat", pochta: "nazorat@diemp.uz", parol: "namuna", rol: "nazorat", ism: "Nazorat mas'uli", tashkilot: null, topshiriqlar: [] },
  { id: "iqtisod", pochta: "iqtisod@diemp.uz", parol: "namuna", rol: "koordinator", ism: "Tashkilot koordinatori", tashkilot: "iqtisod", topshiriqlar: [] },
  { id: "ijro", pochta: "ijro@diemp.uz", parol: "namuna", rol: "ijrochi", ism: "Ijrochi", tashkilot: "qurilish", topshiriqlar: ["NM-01-03", "NM-01-04"] },
  { id: "tahlil", pochta: "tahlil@diemp.uz", parol: "namuna", rol: "tahlilchi", ism: "Tahlilchi", tashkilot: null, topshiriqlar: [] },
]

const grants: Record<Role, string[]> = {
  super_admin: ["*"],
  rahbariyat: ["/", "/hujjatlar", "/qarorlar", "/topshiriqlar", "/hisobotlar", "/dalillar", "/kpi", "/xatarlar", "/tahlil", "/audit"],
  nazorat: ["/", "/hujjatlar", "/topshiriqlar", "/hisobotlar", "/dalillar", "/xatarlar", "/audit"],
  koordinator: ["/", "/topshiriqlar", "/hisobotlar", "/dalillar"],
  ijrochi: ["/", "/topshiriqlar", "/hisobotlar", "/dalillar"],
  tahlilchi: ["/", "/dalillar", "/kpi", "/xatarlar", "/tahlil"],
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
  return rol === "super_admin" || rol === "rahbariyat" || rol === "nazorat"
}

export function canCheckEvidence(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "nazorat" || rol === "tahlilchi"
}

export function canJudgeEvidence(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "nazorat"
}

export function canAskAi(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "tahlilchi"
}
