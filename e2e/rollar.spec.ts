import { expect, test } from "@playwright/test"
import { users } from "../lib/diemp/access"
import { kirish, ochiladi, sahifalar } from "./yordam"

for (const user of users) {
  test(`${user.rol} faqat o'z sahifalarini ochadi`, async ({ page }) => {
    test.setTimeout(180_000)
    await kirish(page, user.rol)

    for (const area of sahifalar) {
      const link = page.getByRole("link", { name: area.nom, exact: true })
      if (ochiladi(user.rol, area.path)) await expect(link.first()).toBeVisible()
      else await expect(link).toHaveCount(0)
    }

    for (const area of sahifalar) {
      if (area.path === "/") continue
      await page.goto(area.path)
      if (ochiladi(user.rol, area.path)) {
        await expect(page).toHaveURL(new RegExp(`${area.path}$`))
        await expect(page.getByRole("heading", { name: area.sarlavha, exact: true })).toBeVisible()
      } else {
        await expect(page).toHaveURL(/\/$/)
        await expect(page.getByRole("heading", { name: area.sarlavha, exact: true })).toHaveCount(0)
      }
    }
  })
}

test("ijrochi faqat o'z topshiriqlarini ko'radi", async ({ page }) => {
  await kirish(page, "ijrochi")
  await expect(page.getByRole("cell", { name: "NM-01-03", exact: true })).toBeVisible()
  await expect(page.getByRole("cell", { name: "NM-01-04", exact: true })).toBeVisible()
  await expect(page.getByText("QR-11")).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Hisobotni yuborish" })).toBeDisabled()
  await page.getByPlaceholder("Bajarilgan ish va dalil haqida qisqa hisobot").fill("qisqa")
  await expect(page.getByRole("button", { name: "Hisobotni yuborish" })).toBeEnabled()
})

test("koordinator faqat o'z tashkilotini ko'radi", async ({ page }) => {
  await kirish(page, "koordinator")
  await expect(page.getByText("QR-11-01")).toBeVisible()
  await expect(page.getByText("FR-22-01")).toHaveCount(0)
  await page.goto("/dalillar")
  await expect(page.getByRole("link", { name: /Qurilish maydoni/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /Ofis stullari/ })).toHaveCount(0)
})

test("tahlilchi topshiriq sahifasiga kirmaydi, dalilni ko'radi", async ({ page }) => {
  await kirish(page, "tahlilchi")
  await page.goto("/topshiriqlar")
  await expect(page).toHaveURL(/\/$/)
  await page.goto("/dalillar/dalil-stullar")
  await expect(page.getByRole("button", { name: "AI rasmni tekshirsin" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Dalil mos", exact: true })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Asl hujjat" })).toHaveCount(0)
})
