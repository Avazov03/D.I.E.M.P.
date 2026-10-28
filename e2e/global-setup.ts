import { rmSync } from "node:fs"
import { dataDir } from "./stand"

export default function setup() {
  rmSync(dataDir, { recursive: true, force: true })
}
