"use server"

import { verifySession } from "@/lib/dal"
import { getIpAddress } from "@/lib/get-ip-address"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteCollectorAction(id: string) {
  const session = await verifySession()
  if (session.role !== "ADMIN") return

  const actor = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!actor) return

  const collector = await prisma.collector.delete({
    where: { id },
    select: { id: true, user: { select: { id: true, name: true } } },
  })

  await prisma.user.delete({
    where: { id: collector.user.id },
  })

  const ipAddress = await getIpAddress()

  await prisma.auditTrail.create({
    data: {
      incident: "Deleted Collector Account",
      details: `${actor.name} (${actor.role}) deleted user: ${collector.user.name} (user id: ${collector.id})`,
      ipAddress,
      incidentLevel: "DANGER",
      actorId: actor.id,
    },
  })

  revalidatePath("/admin/collector-management")

  return {
    success: true,
    message: "Account deleted successfully.",
  }
}
