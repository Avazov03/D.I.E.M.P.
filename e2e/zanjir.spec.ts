import { writeFileSync } from "node:fs"
import { expect, test } from "@playwright/test"
import { kirish } from "./yordam"

test("baholovchi varaqani ochadi va qoralama saqlaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  await page.getByRole("link", { name: "BH-02 ni ochish" }).click()
  await expect(page).toHaveURL(/\/baholash\/BH-02/)
  await expect(page.getByText("Sof ta'sir").first()).toBeVisible()
  await page.getByRole("button", { name: "Qoralama saqlash" }).click()
  await expect(page.getByText(/Qoralama saqlandi/)).toBeVisible()
})

test("hujjat yuklash: rad va muvaffaqiyatli zanjir", async ({ page }) => {
  test.setTimeout(120_000)
  writeFileSync("D:\\tmp\\e2e-not-a-docx.docx", "bu docx emas")
  await kirish(page, "rahbariyat")
  await page.goto("/hujjatlar")

  await page.locator("input[type=file]").setInputFiles("D:\\tmp\\e2e-not-a-docx.docx")
  await page.getByRole("button", { name: "Hujjatni yuklash" }).click()
  await expect(page.getByText("Fayl turi mos emas")).toBeVisible()

  await page.locator("input[type=file]").setInputFiles("content/namuna/qaror-qr-11.docx")
  await page.getByRole("button", { name: "Hujjatni yuklash" }).click()
  await page.waitForURL(/\/hujjatlar\/[0-9a-f-]{36}$/i, { timeout: 90_000 })
  await expect(page.getByRole("link", { name: "Asl faylni ochish" })).toBeVisible()
})

test("baholovchi hujjat faylini ocha olmaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  const response = await page.request.get("/api/hujjat/namuna-qr-11/fayl")
  expect(response.status()).toBe(403)
})
