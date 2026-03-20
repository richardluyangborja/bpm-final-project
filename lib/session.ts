import "server-only"

import "dotenv/config"

import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { UserRole } from "@/generated/prisma/enums"
import { cookies } from "next/headers"

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
export const SESSION_COOKIE_KEY = "kolektasessiontoken"

export interface SessionPayload extends JWTPayload {
  userId: string
  role: UserRole
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined) {
  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload as SessionPayload
  } catch (error) {
    console.log(`Failed to verify session: ${error}`)
  }
}

export async function createSession(userId: string, role: UserRole) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, role })
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_KEY, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_KEY)
}
