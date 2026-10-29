import { expect, test } from "@playwright/test"
import { kirish, tanla } from "./yordam"

test("qidiruv, mavzu, bildirishnoma va yangilash", async ({ page }) => {
  await kirish(page, "rahbariyat")

  await page.getByPlaceholder("Qidirish...").fill("Baholash")
  await page.locator(".absolute a[href='/baholash']").first().click()
  await expect(page).toHaveURL(/\/baholash$/)

  await page.getByPlaceholder("Qidirish...").fill("yoq-bunday-sahifa")
  await expect(page.getByRole("heading", { name: "Hech narsa topilmadi" })).toBeVisible()

  const html = page.locator("html")
  const before = (await html.getAttribute("class")) ?? ""
  await page.locator("button:has(svg.lucide-moon), button:has(svg.lucide-sun)").first().click()
  await expect.poll(async () => html.getAttribute("class")).not.toBe(before)

  await page.locator("svg.lucide-bell").click()
  await page.getByRole("link", { name: "Audit jurnalini ochish" }).click()
  await expect(page).toHaveURL(/\/audit$/)

  await page.goto("/")
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "Eksport" }).click()
  expect((await download).suggestedFilename()).toBe("ttb-baholash.csv")
  await expect(page.getByRole("main").getByText("Tartibga solish ta'sirini baholash")).toBeVisible()
})

test("baholovchi yopiq sahifani qidiruvda ko'rmaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  await page.getByPlaceholder("Qidirish...").fill("Monitoring")
  await expect(page.getByRole("heading", { name: "Hech narsa topilmadi" })).toBeVisible()
})

test("royxat filtrlari ishlaydi", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await page.goto("/hisobotlar")
  await tanla(page, /Holat:/, "Tasdiq kutilmoqda")
  await expect(page).toHaveURL(/holat=kutilmoqda/)

  await page.goto("/monitoring")
  await tanla(page, /Holat:/, "Monitoring")
  await expect(page).toHaveURL(/holat=monitoring/)
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
