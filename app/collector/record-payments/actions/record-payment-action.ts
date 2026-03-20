"use server"

import prisma from "@/lib/prisma"
import { verifySession } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { getIpAddress } from "@/lib/get-ip-address"
import { money } from "@/lib/money"

export async function recordPaymentAction({
  loanId,
  installmentId,
  amount, // already in cents
  note,
}: {
  loanId: string
  installmentId: string
  amount: number
  note?: string
}) {
  const session = await verifySession()

  return await prisma.$transaction(async (tx) => {
    // ensure installment exists
    const installment = await tx.loanInstallment.findUniqueOrThrow({
      where: { id: installmentId },
      include: {
        loan: { include: { borrower: { select: { name: true } } } },
      },
    })

    if (installment.status === "PAID") {
      return {
        success: false,
        message: "Installment already paid",
      }
    }

    // get collector
    const collector = await tx.collector.findUniqueOrThrow({
      where: { userId: session.userId },
      include: { user: { select: { id: true, name: true, role: true } } },
    })

    // create payment
    await tx.payment.create({
      data: {
        loanId,
        installmentId,
        collectorId: collector.id,
        amount,
        notes: note,
      },
    })

    // update installment
    await tx.loanInstallment.update({
      where: { id: installmentId },
      data: {
        status: "PAID",
      },
    })

    // update loan balance
    await tx.loan.update({
      where: { id: loanId },
      data: {
        totalBalance: {
          decrement: amount,
        },
      },
    })

    const ipAddress = await getIpAddress()

    // audit trail
    await tx.auditTrail.create({
      data: {
        actorId: session.userId,
        incident: "New Payment Collection",
        incidentLevel: "INFO",
        details: `${collector.user.name} (${collector.user.role}) collected ${money.format(money.fromCents(amount))} payment from ${installment.loan.borrower.name} (borrower id: ${installment.loan.borrowerId}) for loan ${installment.loan.purpose} (loan id: ${loanId})`,
        ipAddress,
      },
    })

    revalidatePath("/collector/record-payments")

    return {
      success: true,
      message: "Payment recorded successfully.",
    }
  })
}
