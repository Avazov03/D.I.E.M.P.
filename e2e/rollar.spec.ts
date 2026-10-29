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

test("baholovchi faqat o'z varaqalarini ko'radi", async ({ page }) => {
  await kirish(page, "ijrochi")
  await expect(page.getByRole("cell", { name: "BH-02", exact: true })).toBeVisible()
  await expect(page.getByRole("cell", { name: "BH-03", exact: true })).toBeVisible()
  await expect(page.getByText("BH-01")).toHaveCount(0)
})

test("koordinator faqat o'z organini ko'radi", async ({ page }) => {
  await kirish(page, "koordinator")
  await page.goto("/baholash")
  await expect(page.getByText("BH-01")).toBeVisible()
  await expect(page.getByText("BH-02")).toHaveCount(0)
})

test("tahlilchi AI ochadi, hujjat yuklashga kirmaydi", async ({ page }) => {
  await kirish(page, "tahlilchi")
  await page.goto("/hujjatlar")
  await expect(page).toHaveURL(/\/$/)
  await page.goto("/tahlil")
  await expect(page.getByRole("heading", { name: "AI yordamchi", exact: true })).toBeVisible()
})
