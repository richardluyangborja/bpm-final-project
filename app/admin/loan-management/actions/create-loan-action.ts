"use server"

import prisma from "@/lib/prisma"
import { verifySession } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { getIpAddress } from "@/lib/get-ip-address"
import { money } from "@/lib/money"

export async function createLoanAction(data: {
  borrowerId: string
  purpose: string
  principal: number
  interestRate: number
  numberOfPayments: number
  paymentFrequency: "WEEKLY" | "MONTHLY"
  startDate: string
}) {
  const session = await verifySession()
  if (session.role !== "ADMIN") return

  const actor = await prisma.user.findUnique({
    where: { id: session.userId },
  })
  if (!actor) return

  const principalCents = money.toCents(data.principal)

  const totalBalance =
    principalCents + Math.round(principalCents * (data.interestRate / 100))

  const installmentAmount = Math.floor(totalBalance / data.numberOfPayments)

  const [y, m, d] = data.startDate.split("-").map(Number)
  const startDate = new Date(y, m - 1, d)

  const installments = Array.from({ length: data.numberOfPayments }, (_, i) => {
    const dueDate = new Date(startDate)
    dueDate.setHours(0, 0, 0, 0)

    if (data.paymentFrequency === "MONTHLY") {
      dueDate.setMonth(dueDate.getMonth() + i + 1)
    } else {
      dueDate.setDate(dueDate.getDate() + (i + 1) * 7)
    }

    return {
      dueDate,
      amount: installmentAmount,
    }
  })

  const loan = await prisma.loan.create({
    data: {
      borrowerId: data.borrowerId,
      purpose: data.purpose,
      principalAmount: principalCents,
      totalBalance,
      interest: data.interestRate,
      startDate,
      paymentFrequency: data.paymentFrequency,
      numberOfPayments: data.numberOfPayments,
      installments: {
        create: installments,
      },
    },
    include: { borrower: { select: { name: true } } },
  })

  const ipAddress = await getIpAddress()

  await prisma.auditTrail.create({
    data: {
      incident: "Created Loan",
      details: `${actor.name} (${actor.role}) created loan: ${loan.purpose} (loan id: ${loan.id}) of ${loan.borrower.name} (borrower id: ${loan.borrowerId})`,
      ipAddress,
      incidentLevel: "INFO",
      actorId: actor.id,
    },
  })

  revalidatePath("/admin/loan-management")

  return {
    success: true,
    message: "Loan created successfully.",
  }
}
