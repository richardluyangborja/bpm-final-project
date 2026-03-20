"use server"

import { verifySession } from "@/lib/dal"
import { getIpAddress } from "@/lib/get-ip-address"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"

export async function createCollectorAction({
  fullname,
  email,
  password,
}: {
  fullname: string
  email: string
  password: string
}) {
  const session = await verifySession()
  if (session.role !== "ADMIN") return

  const actor = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!actor) return

  const duplicateCollector = await prisma.user.findUnique({ where: { email } })
  if (duplicateCollector)
    return { success: false, message: "Email already exists." }

  const hashedPassword = await bcrypt.hash(password, 10)
  const collector = await prisma.collector.create({
    data: {
      user: {
        create: {
          name: fullname,
          email,
          password: hashedPassword,
          role: "COLLECTOR",
        },
      },
    },
    include: { user: true },
  })

  const ipAddress = await getIpAddress()

  await prisma.auditTrail.create({
    data: {
      incident: "Created Collector Account",
      details: `${actor.name} (${actor.role}) created user: ${collector.user.name} (user id: ${collector.id})`,
      ipAddress,
      incidentLevel: "INFO",
      actorId: actor.id,
    },
  })

  revalidatePath("/admin/collector-management")

  return {
    success: true,
    message: "Account created successfully.",
  }
}
