import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CurvyRightDirectionFreeIcons,
  MedalFirstPlaceFreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { PerformanceChart } from "./components/PerformanceChart"
import CollectorsTable from "./components/CollectorsTable"
import CreateCollectorButton from "./components/CreateCollectorButton"
import prisma from "@/lib/prisma"
import { startOfDay, subDays } from "date-fns"
import { money } from "@/lib/money"
import { AutoRefresh } from "@/components/util/AutoRefresh"

export default async function page() {
  const today = new Date()
  const last7Days = subDays(today, 6)

  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: startOfDay(last7Days),
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  })

  const map = new Map<
    string,
    { date: string; transaction: number; amount: number }
  >()

  for (let i = 0; i < 7; i++) {
    const d = subDays(today, i)
    const key = d.toISOString().split("T")[0]

    map.set(key, {
      date: key,
      transaction: 0,
      amount: 0,
    })
  }

  payments.forEach((p) => {
    const key = p.createdAt.toISOString().split("T")[0]

    if (!map.has(key)) return

    const current = map.get(key)!
    current.transaction += 1
    current.amount += money.fromCents(p.amount)
  })

  const chartData = Array.from(map.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  const collectorStats = await prisma.payment.groupBy({
    by: ["collectorId"],
    where: {
      createdAt: {
        gte: startOfDay(last7Days),
      },
    },
    _sum: {
      amount: true,
    },
    _count: {
      _all: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: 1,
  })

  let topCollector = null

  if (collectorStats.length > 0) {
    const top = collectorStats[0]

    const collector = await prisma.collector.findUnique({
      where: {
        id: top.collectorId,
      },
      select: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    topCollector = {
      name: collector?.user.name ?? "Unknown",
      email: collector?.user.email ?? "—",
      totalAmount: top._sum.amount ?? 0,
      transactions: top._count._all,
    }
  }

  const collectorData = prisma.collector.findMany({
    select: {
      id: true,
      payments: {
        select: {
          amount: true,
          createdAt: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return (
    <section className="flex flex-col gap-4 p-8">
      <AutoRefresh />
      <Card className="border border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <HugeiconsIcon
              className="text-emerald-400"
              icon={MedalFirstPlaceFreeIcons}
            />
            <div>
              <CardTitle className="text-emerald-400">
                Top collector last week
              </CardTitle>
              <CardDescription>
                Highest collections in the last 7 days
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="my-8 flex items-center justify-evenly">
            <div>
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {topCollector?.name ?? "No data"}
              </h1>
              <p className="text-muted-foreground">
                {topCollector?.email ?? ""}
              </p>
            </div>
            <div>
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight text-emerald-400">
                {money.format(money.fromCents(topCollector?.totalAmount ?? 0))}{" "}
                Total Collection
              </h1>
              <p className="text-muted-foreground">
                {topCollector?.transactions ?? 0} transactions
              </p>
            </div>
          </div>

          <PerformanceChart data={chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={CurvyRightDirectionFreeIcons} />
            <div>
              <CardTitle>All-Time Collector Performance</CardTitle>
              <CardDescription>
                Transaction statistics and collection totals
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <CreateCollectorButton />
          </CardAction>
        </CardHeader>
        <CardContent>
          <CollectorsTable data={collectorData} />
        </CardContent>
      </Card>
    </section>
  )
}
