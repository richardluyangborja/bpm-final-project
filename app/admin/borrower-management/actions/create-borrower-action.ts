"use server"

import { verifySession } from "@/lib/dal"
import { getIpAddress } from "@/lib/get-ip-address"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBorrowerAction({
  name,
  email,
  contact,
  address,
}: {
  name: string
  email: string
  contact: string
  address: string
}) {
  const session = await verifySession()
  if (session.role !== "ADMIN") return

  const actor = await prisma.user.findUnique({
    where: { id: session.userId },
  })
  if (!actor) return

  const duplicateBorrower = await prisma.borrower.findFirst({
    where: { email },
  })

  if (duplicateBorrower)
    return { success: false, message: "Email already exists." }

  const borrower = await prisma.borrower.create({
    data: {
      name,
      email,
      contact,
      address,
    },
  })

  const ipAddress = await getIpAddress()

  await prisma.auditTrail.create({
    data: {
      incident: "Created Borrower Account",
      details: `${actor.name} (${actor.role}) created user: ${borrower.name} (user id: ${borrower.id})`,
      ipAddress,
      incidentLevel: "INFO",
      actorId: actor.id,
    },
  })

  revalidatePath("/admin/borrower-management")

  return {
    success: true,
    message: "Borrower created successfully.",
  }
}
