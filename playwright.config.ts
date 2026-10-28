import { defineConfig, devices } from "@playwright/test"
import { dataDir, port } from "./e2e/stand"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 20_000 },
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "uz-UZ",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next dev --port ${port}`,
    url: `http://localhost:${port}/auth/auth2/login`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      ...process.env,
      DIEMP_DATA_DIR: dataDir,
      TEMP: "D:\\tmp\\temp",
      TMP: "D:\\tmp\\temp",
    },
  },
})
