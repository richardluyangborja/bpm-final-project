import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Book04FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import PaymentRecordsTable from "./components/PaymentRecordsTable"
import prisma from "@/lib/prisma"
import { AutoRefresh } from "@/components/util/AutoRefresh"

async function getPayments() {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      loan: {
        include: {
          borrower: true,
        },
      },
      collector: {
        include: {
          user: true,
        },
      },
    },
  })
}

export default function page() {
  const paymentsPromise = getPayments()

  return (
    <section className="p-8">
      <AutoRefresh />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Book04FreeIcons} />
            <div>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>View all payment transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentRecordsTable paymentsPromise={paymentsPromise} />
        </CardContent>
      </Card>
    </section>
  )
}
