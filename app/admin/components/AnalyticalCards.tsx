"use client"

import { use } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChartLineData01FreeIcons,
  Coins01FreeIcons,
  LaborFreeIcons,
  MedalFirstPlaceFreeIcons,
  UserMultiple02FreeIcons,
} from "@hugeicons/core-free-icons"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { money } from "@/lib/money"

type AnalyticsData = {
  topCollector?: {
    name: string
    total: number
  }
  totalCollection: number
  transactionsCount: number
  collectorsCount: number
}

export default function AnalyticalCards({
  analyticsPromise,
}: {
  analyticsPromise: Promise<AnalyticsData>
}) {
  const data = use(analyticsPromise)

  return (
    <section className="grid gap-8 px-8 py-8 lg:grid-cols-3">
      {/* Top Collector */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-3">
              <HugeiconsIcon size={20} icon={MedalFirstPlaceFreeIcons} />
              Today&apos;s Top Collector
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-xl font-semibold">
            {data.topCollector?.name ?? "N/A"}
          </h1>
        </CardContent>
        <CardFooter>
          <HugeiconsIcon icon={Coins01FreeIcons} size={16} />
          <p className="ml-2">
            {money
              .format(money.fromCents(data.topCollector?.total ?? 0))
              .toLocaleString()}{" "}
            collected
          </p>
        </CardFooter>
      </Card>

      {/* Total Collection */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-3">
              <HugeiconsIcon size={20} icon={Coins01FreeIcons} />
              Today&apos;s Total Collection
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-xl font-semibold text-emerald-400">
            {money.format(money.fromCents(data.totalCollection))}
          </h1>
        </CardContent>
        <CardFooter>
          <HugeiconsIcon size={16} icon={ChartLineData01FreeIcons} />
          <p className="ml-1">{data.transactionsCount} transactions today</p>
        </CardFooter>
      </Card>

      {/* Collectors */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-3">
              <HugeiconsIcon size={20} icon={UserMultiple02FreeIcons} />
              Field Collectors
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-xl font-semibold">{data.collectorsCount}</h1>
        </CardContent>
        <CardFooter>
          <HugeiconsIcon size={16} icon={LaborFreeIcons} />
          <p className="ml-1">Total collectors</p>
        </CardFooter>
      </Card>
    </section>
  )
}
