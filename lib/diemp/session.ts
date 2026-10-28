import { cookies } from "next/headers"
import { sessionCookie, userById } from "@/lib/diemp/access"

export { sessionCookie }

export async function currentUser() {
  const jar = await cookies()
  return userById(jar.get(sessionCookie)?.value)
}
