"use server"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getIpAddress } from "@/lib/get-ip-address"

export async function deleteLoanAction(id: string) {
  const session = await verifySession()
  if (session.role !== "ADMIN") return

  const actor = await prisma.user.findUnique({
    where: { id: session.userId },
  })
  if (!actor) return

  const loan = await prisma.loan.delete({
    where: { id },
    select: {
      id: true,
      purpose: true,
      borrower: { select: { id: true, name: true } },
    },
  })

  const ipAddress = await getIpAddress()

  await prisma.auditTrail.create({
    data: {
      incident: "Deleted Loan",
      details: `${actor.name} (${actor.role}) deleted ${loan.purpose} (loan id: ${loan.id}) of borrower: ${loan.borrower.name} (borrower id: ${loan.borrower.id}) (loan id: ${loan.id})`,
      ipAddress,
      incidentLevel: "DANGER",
      actorId: actor.id,
    },
  })

  revalidatePath("/admin/loan-management")

  return {
    success: true,
    message: "Loan deleted successfully.",
  }
}
