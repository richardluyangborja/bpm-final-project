import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar04FreeIcons,
  ChartLineData01FreeIcons,
  Clock02FreeIcons,
  Coins01FreeIcons,
} from "@hugeicons/core-free-icons"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { money } from "@/lib/money"
import { DateTime } from "luxon"

export function AnalyticalCards({
  data,
}: {
  data: {
    totalCollection?: number
    transactionCount?: number
    lastCollectionDate?: Date
  }
}) {
  let lastCollectionDate
  if (data.lastCollectionDate)
    lastCollectionDate = DateTime.fromJSDate(data.lastCollectionDate).setZone(
      "Asia/Manila"
    )

  return (
    <section className="grid gap-8 px-8 py-8 pb-0 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-3">
              <HugeiconsIcon size={20} icon={Coins01FreeIcons} />
              Your Today&apos;s Collection
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight text-emerald-400">
            {money.format(money.fromCents(data.totalCollection ?? 0))}
          </h1>
        </CardContent>
        <CardFooter>
          <HugeiconsIcon size={16} icon={ChartLineData01FreeIcons} />
          <p className="ml-1">
            {data.transactionCount ?? 0} transactions today
          </p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-3">
              <HugeiconsIcon size={20} icon={Clock02FreeIcons} />
              Last Collection
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {lastCollectionDate
              ? lastCollectionDate.toFormat("hh:mm a")
              : "N/A"}
          </h1>
        </CardContent>
        <CardFooter>
          <HugeiconsIcon size={16} icon={Calendar04FreeIcons} />
          <p className="ml-1">
            {lastCollectionDate
              ? lastCollectionDate.toFormat("M/d/yyyy")
              : "N/A"}
          </p>
        </CardFooter>
      </Card>
    </section>
  )
}
