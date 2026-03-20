import "dotenv/config"

import { Prisma } from "@/generated/prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function main() {
  const password = "yellasupercutie123@"
  const hashed = await bcrypt.hash(password, 10)

  const userData: Prisma.UserCreateInput[] = [
    {
      email: "borja.richard.luyang@gmail.com",
      password: hashed,
      name: "Richard Borja",
      role: "ADMIN",
    },
  ]

  for (const u of userData) {
    await prisma.user.create({ data: u })
  }
}

main()
