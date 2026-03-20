"use server"

import prisma from "@/lib/prisma"
import { verifySession } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { getIpAddress } from "@/lib/get-ip-address"
import { money } from "@/lib/money"
import { DateTime } from "luxon"

export async function createLoanAction(data: {
  borrowerId: string
  purpose: string
  principal: number
  interestRate: number
  numberOfPayments: number
  paymentFrequency: "WEEKLY" | "MONTHLY"
  startDate: string
}) {
  const zone = "Asia/Manila"

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

  const startDateLuxon = DateTime.fromISO(data.startDate, { zone }).startOf(
    "day"
  )

  const startDate = startDateLuxon.toUTC().toJSDate()

  const installments = Array.from({ length: data.numberOfPayments }, (_, i) => {
    let due = startDateLuxon

    if (data.paymentFrequency === "MONTHLY") {
      due = due.plus({ months: i + 1 })
    } else {
      due = due.plus({ weeks: i + 1 })
    }

    return {
      dueDate: due.startOf("day").toUTC().toJSDate(),
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
