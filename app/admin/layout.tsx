import { ReactNode } from "react"
import AdminNavigationMenu from "./components/AdminNavigationMenu"
import AccountDropdown from "./components/AccountDropdown"
import prisma from "@/lib/prisma"
import { verifySession } from "@/lib/dal"
import AnalyticalCards from "./components/AnalyticalCards"

export default async function layout({ children }: { children: ReactNode }) {
  const session = await verifySession()

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.userId },
    select: { name: true },
  })

  const analyticsPromise = getAnalytics()

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-card px-8 py-3">
        <div>
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Kolekta
          </h1>
          <p className="text-sm text-muted-foreground">
            Administrator Dashboard
          </p>
        </div>
        <AccountDropdown user={user} />
      </header>

      <AnalyticalCards analyticsPromise={analyticsPromise} />

      <AdminNavigationMenu />
      <main>{children}</main>
    </>
  )
}

async function getAnalytics() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // total collection today
  const paymentsToday = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    include: {
      collector: {
        include: {
          user: true,
        },
      },
    },
  })

  const totalCollection = paymentsToday.reduce((sum, p) => sum + p.amount, 0)

  const transactionsCount = paymentsToday.length

  // group by collector
  const collectorMap = new Map<string, { name: string; total: number }>()

  for (const payment of paymentsToday) {
    const name = payment.collector.user.name

    if (!collectorMap.has(payment.collectorId)) {
      collectorMap.set(payment.collectorId, {
        name,
        total: 0,
      })
    }

    collectorMap.get(payment.collectorId)!.total += payment.amount
  }

  const topCollector = [...collectorMap.values()].sort(
    (a, b) => b.total - a.total
  )[0]

  const collectorsCount = await prisma.collector.count()

  return {
    topCollector,
    totalCollection,
    transactionsCount,
    collectorsCount,
  }
}
