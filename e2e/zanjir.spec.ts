import { writeFileSync } from "node:fs"
import { expect, test } from "@playwright/test"
import { kirish } from "./yordam"

test("ijrochi hisoboti tasdiqsiz qoladi va rasmiy foiz o'zgarmaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  await page.getByRole("radio").first().check()
  await page.getByPlaceholder("Bajarilgan ish va dalil haqida qisqa hisobot").fill("E2E hisobot matni yetarli")
  await page.getByRole("button", { name: "Hisobotni yuborish" }).click()
  await expect(page.getByText(/tasdiq navbatiga qo'yildi\. Bu rasmiy foizga hali kirmaydi/)).toBeVisible()
  await page.getByRole("link", { name: "Hisobotlar ro'yxati" }).click()
  await expect(page.getByText("E2E hisobot matni yetarli")).toBeVisible()
  await expect(page.getByText("Tasdiq kutilmoqda").first()).toBeVisible()

  await page.context().clearCookies()
  await kirish(page, "rahbariyat")
  await expect(page.getByRole("link", { name: /67% Jismoniy bajarilish/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /71% Moliyaviy bajarilish/ })).toBeVisible()
})

test("hujjat zanjiri: rad, yuklash, bo'sh tasdiq, odam tasdig'i", async ({ page }) => {
  test.setTimeout(120_000)
  writeFileSync("D:\\tmp\\e2e-not-a-docx.docx", "bu docx emas")
  await kirish(page, "rahbariyat")
  await page.goto("/hujjatlar")
  await expect(page.getByRole("link", { name: /qaror-qr-11/ })).toBeVisible()

  await page.locator("input[type=file]").setInputFiles("D:\\tmp\\e2e-not-a-docx.docx")
  await page.getByRole("button", { name: "Hujjatni yuklash" }).click()
  await expect(page.getByText("Fayl turi mos emas")).toBeVisible()

  await page.locator("input[type=file]").setInputFiles("content/namuna/qaror-qr-11.docx")
  await page.getByRole("button", { name: "Hujjatni yuklash" }).click()
  await page.waitForURL(/\/hujjatlar\/[0-9a-f-]{36}$/i, { timeout: 90_000 })
  await expect(page.getByRole("link", { name: "Asl faylni ochish" })).toBeVisible()

  const file = await page.request.get(page.url().replace(/.*\/hujjatlar\//, "/api/hujjat/") + "/fayl")
  expect(file.status()).toBe(200)

  const raqam = page.getByLabel("Qaror raqami")
  await raqam.fill("")
  await page.getByRole("button", { name: "Tasdiqlash" }).click()
  await expect(page.getByText("Qaror raqami kerak")).toBeVisible()

  await raqam.fill("E2E91")
  await page.getByLabel("Nomi").fill("E2E sinov hujjati")
  await page.getByPlaceholder("Topshiriq matni").first().fill("E2E topshiriq matni")
  await page.getByPlaceholder("Muddat").first().fill("01.12.2026")
  await page.locator("select").first().selectOption("iqtisod")
  await page.getByRole("button", { name: "Topshiriq qo'shish" }).click()
  await expect(page.getByPlaceholder("Topshiriq matni")).toHaveCount(2)
  await page.getByRole("button", { name: "Tasdiqlash" }).click()
  await expect(page.getByText("Tasdiqlandi. Topshiriqlar ro'yxatida manbasi Hujjat deb turadi.")).toBeVisible()
  await page.getByRole("link", { name: "Topshiriqlar ro'yxati" }).click()
  await expect(page.getByText("E2E91-01")).toBeVisible()

  await page.goto("/")
  await expect(page.getByRole("link", { name: /67% Jismoniy bajarilish/ })).toBeVisible()
})

test("ijrochi hujjat faylini ocha olmaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  const response = await page.request.get("/api/hujjat/namuna-qr-11/fayl")
  expect(response.status()).toBe(403)
})
