import { expect, test } from "@playwright/test"
import { kirish, tanla } from "./yordam"

test("qidiruv, mavzu, bildirishnoma va yangilash", async ({ page }) => {
  await kirish(page, "rahbariyat")

  await page.getByPlaceholder("Qidirish...").fill("Dalillar")
  await page.getByRole("link", { name: "Dalillar" }).last().click()
  await expect(page).toHaveURL(/\/dalillar$/)

  await page.getByPlaceholder("Qidirish...").fill("yoq-bunday-sahifa")
  await expect(page.getByRole("heading", { name: "Hech narsa topilmadi" })).toBeVisible()

  const html = page.locator("html")
  const before = (await html.getAttribute("class")) ?? ""
  await page.locator("button:has(svg.lucide-moon), button:has(svg.lucide-sun)").first().click()
  await expect.poll(async () => html.getAttribute("class")).not.toBe(before)

  await page.locator("svg.lucide-bell").click()
  await page.getByRole("link", { name: "Audit jurnalini ochish" }).click()
  await expect(page).toHaveURL(/\/audit$/)
  await expect(page.getByRole("heading", { name: "Audit jurnali" })).toBeVisible()

  await page.goto("/")
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "Eksport" }).click()
  expect((await download).suggestedFilename()).toBe("diemp-topshiriqlar.csv")
  await expect(page.getByText(/3 ta maxfiy yozuv kiritilmadi/)).toBeVisible()

  await page.locator("button:has(svg.lucide-refresh-ccw)").click()
  await expect(page.getByRole("main").getByText("Namuna ma'lumot")).toBeVisible()
})

test("ijrochi yopiq sahifani qidiruvda ko'rmaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  await page.getByPlaceholder("Qidirish...").fill("KPI")
  await expect(page.getByRole("heading", { name: "Hech narsa topilmadi" })).toBeVisible()
})

test("royxat filtrlari va KPI holati", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await page.goto("/hisobotlar")
  await tanla(page, /Tekshiruv:/, "Tasdiq kutilmoqda")
  await expect(page).toHaveURL(/holat=kutilmoqda/)
  await expect(page.getByText(/\d+ ta yozuv/)).toBeVisible()

  await page.goto("/xatarlar")
  await tanla(page, /Daraja:/, "Yuqori")
  await expect(page).toHaveURL(/daraja=yuqori/)

  await page.goto("/kpi")
  await tanla(page, /Holat:/, "Hisoblanmaydi")
  await expect(page).toHaveURL(/holat=hisoblanmaydi/)
  await expect(page.getByText("Hisoblanmaydi").first()).toBeVisible()
})

test("yo'q sahifa va pastki havola", async ({ page }) => {
  await kirish(page, "super_admin")
  await page.goto("/bunday-sahifa-yoq")
  await expect(page.getByRole("heading", { name: "Opps!!!" })).toBeVisible()
  await page.getByRole("link", { name: "Go Back to Home" }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("link", { name: "Shadcn Dashboard" })).toHaveAttribute("href", "https://shadcndashboard.dev/")
})

test("super administrator foydalanuvchilarni ko'radi", async ({ page }) => {
  await kirish(page, "super_admin")
  await page.getByRole("link", { name: "Foydalanuvchilar" }).click()
  for (const mail of ["admin@diemp.uz", "rahbar@diemp.uz", "nazorat@diemp.uz", "iqtisod@diemp.uz", "ijro@diemp.uz", "tahlil@diemp.uz"]) {
    await expect(page.getByText(mail)).toBeVisible()
  }
})
