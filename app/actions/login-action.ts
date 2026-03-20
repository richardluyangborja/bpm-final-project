"use server"

import prisma from "@/lib/prisma"
import { createSession } from "@/lib/session"
import * as bcrypt from "bcrypt"
import { redirect } from "next/navigation"

export async function loginAction(data: { email: string; password: string }) {
  const ERROR_FEEDBACK = "Incorrect username or password."
  const { email, password } = data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { success: false, message: ERROR_FEEDBACK }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) return { success: false, message: ERROR_FEEDBACK }

  await createSession(user.id, user.role)
  switch (user.role) {
    case "ADMIN":
      redirect("/admin/collector-management")
    case "COLLECTOR":
      redirect("/collector/record-payments")
  }
}
