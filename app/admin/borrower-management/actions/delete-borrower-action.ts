"use server"

import { verifySession } from "@/lib/dal"
import { getIpAddress } from "@/lib/get-ip-address"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteBorrowerAction(id: string) {
  const session = await verifySession()
  if (session.role !== "ADMIN") return

  const actor = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!actor) return

  const borrower = await prisma.borrower.delete({
    where: { id },
    select: { id: true, name: true },
  })

  const ipAddress = await getIpAddress()

  await prisma.auditTrail.create({
    data: {
      incident: "Deleted Borrower Account",
      details: `${actor.name} (${actor.role}) deleted user: ${borrower.name} (user id: ${borrower.id})`,
      ipAddress,
      incidentLevel: "DANGER",
      actorId: actor.id,
    },
  })

  revalidatePath("/admin/borrower-management")

  return {
    success: true,
    message: "Account deleted successfully.",
  }
}
