import { expect, type Page } from "@playwright/test"
import { canOpen, roleLabel, users, type Role } from "../lib/diemp/access"

export const sahifalar = [
  { path: "/", nom: "Dashboard", sarlavha: "" },
  { path: "/hujjatlar", nom: "Hujjat yuklash", sarlavha: "Hujjatni tizimga kiritish" },
  { path: "/reyestr", nom: "Reyestr", sarlavha: "Normativ-huquqiy hujjatlar reyestri" },
  { path: "/baholash", nom: "Baholash", sarlavha: "Tartibga solish ta'sirini baholash" },
  { path: "/hisobotlar", nom: "Hisobotlar", sarlavha: "Elektron hisobotlar" },
  { path: "/monitoring", nom: "Monitoring", sarlavha: "Monitoring va natijadorlik" },
  { path: "/tahlil", nom: "AI yordamchi", sarlavha: "AI yordamchi" },
  { path: "/audit", nom: "Audit jurnali", sarlavha: "Audit jurnali" },
  { path: "/foydalanuvchilar", nom: "Foydalanuvchilar", sarlavha: "Foydalanuvchilar" },
] as const

export function account(rol: Role) {
  const user = users.find((item) => item.rol === rol)
  if (!user) throw new Error(rol)
  return user
}

export async function kirish(page: Page, rol: Role) {
  await page.goto("/auth/auth2/login")
  await page.getByRole("button", { name: roleLabel[rol] }).click()
  await page.waitForURL((url) => url.pathname === "/")
  await expect(page.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible()
  return account(rol)
}

export async function tanla(page: Page, joriy: RegExp, variant: string) {
  await page.getByRole("combobox").filter({ hasText: joriy }).click()
  const option = page.getByRole("option", { name: variant, exact: true })
  await expect(option).toBeVisible()
  await option.click()
}

export function ochiladi(rol: Role, path: string) {
  if (path === "/foydalanuvchilar") return rol === "super_admin"
  return canOpen(rol, path)
}
