import { ReactNode } from "react"
import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import AccountDropdown from "./components/AccountDropdown"
import { AnalyticalCards } from "./components/AnalyticalCards"
import { DateTime } from "luxon"

export default async function layout({ children }: { children: ReactNode }) {
  const session = await verifySession()

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.userId },
    select: { name: true, collector: { select: { id: true } } },
  })

  const zone = "Asia/Manila"

  const start = DateTime.now().setZone(zone).startOf("day").toUTC().toJSDate()

  const end = DateTime.now().setZone(zone).endOf("day").toUTC().toJSDate()

  const transactions = await prisma.payment.findMany({
    where: {
      collectorId: user.collector!.id,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  })

  const totalCollection = transactions.reduce((sum, t) => sum + t.amount, 0)
  const transactionCount = transactions.length

  const lastCollectionDate = (
    await prisma.payment.findFirst({
      where: { collectorId: user.collector!.id },
      orderBy: { createdAt: "desc" },
    })
  )?.createdAt

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-card px-8 py-3">
        <div>
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Kolekta
          </h1>
          <p className="text-sm text-muted-foreground">
            Field Collector Dashboard
          </p>
        </div>
        <AccountDropdown user={user} />
      </header>
      <AnalyticalCards
        data={{ totalCollection, transactionCount, lastCollectionDate }}
      />
      <main>{children}</main>
    </>
  )
}
