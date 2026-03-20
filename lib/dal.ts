import "server-only"

import { cookies } from "next/headers"
import { cache } from "react"
import { decrypt, SESSION_COOKIE_KEY } from "./session"
import { redirect } from "next/navigation"

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(SESSION_COOKIE_KEY)?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect("/")
  }

  return { isAuth: true, userId: session.userId, role: session.role }
})
