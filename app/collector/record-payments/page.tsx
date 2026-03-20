import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { money } from "@/lib/money"
import {
  AlertSquareFreeIcons,
  Calendar04FreeIcons,
  Clock02FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import RecordPaymentDrawer from "./components/RecordPaymentDrawer"
import prisma from "@/lib/prisma"
import NewPaymentDrawer from "./components/NewPaymentDrawer"
import { verifySession } from "@/lib/dal"
import PaymentRecordsTable from "./components/PaymentRecordsTable"
import { AutoRefresh } from "@/components/util/AutoRefresh"
import { DateTime } from "luxon"

export default async function page() {
  const session = await verifySession()

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.userId },
    select: {
      collector: {
        select: {
          id: true,
        },
      },
    },
  })

  const payments = prisma.payment.findMany({
    where: { collectorId: user.collector?.id },
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

  const borrowers = await prisma.borrower.findMany({
    include: {
      loans: {
        include: {
          installments: {
            where: { status: "PENDING" },
            orderBy: { dueDate: "asc" },
          },
        },
      },
    },
  })

  const zone = "Asia/Manila"

  const start = DateTime.now().setZone(zone).startOf("day").toUTC().toJSDate()

  const end = DateTime.now().setZone(zone).endOf("day").toUTC().toJSDate()

  const dueToday = await prisma.loanInstallment.findMany({
    where: {
      dueDate: {
        gte: start,
        lte: end,
      },
      status: "PENDING",
    },
    include: {
      loan: {
        include: {
          borrower: true,
          installments: true,
        },
      },
    },
  })

  const overdue = await prisma.loanInstallment.findMany({
    where: {
      dueDate: {
        lt: start,
      },
      status: "PENDING",
    },
    include: {
      loan: {
        include: {
          borrower: true,
          installments: true,
        },
      },
    },
  })

  return (
    <section className="p-8">
      <AutoRefresh />
      <section className="mb-8">
        <NewPaymentDrawer borrowers={borrowers} />
      </section>
      <section className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Calendar04FreeIcons} />
              <div>
                <CardTitle>Borrower Loans Due Today</CardTitle>
                <CardDescription>
                  {dueToday.length} total payment scheduled to be collected
                  today
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {dueToday.map((inst) => {
              const index =
                inst.loan.installments.findIndex((i) => i.id === inst.id) + 1

              return (
                <Card key={inst.id}>
                  <CardHeader>
                    <CardTitle>{inst.loan.borrower.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <p>{inst.loan.purpose}</p>
                        <Separator orientation="vertical" />
                        <p>
                          Installment {index}/{inst.loan.numberOfPayments}
                        </p>
                      </div>
                    </CardDescription>
                    <CardAction>
                      <RecordPaymentDrawer
                        loanId={inst.loanId}
                        installmentId={inst.id}
                        amount={inst.amount}
                        borrowerName={inst.loan.borrower.name}
                        installmentLabel={`${index}/${inst.loan.numberOfPayments}`}
                      />
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight text-emerald-400">
                      {money.format(money.fromCents(inst.amount))}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      </section>
      {/* oerdues */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <HugeiconsIcon
                className="text-destructive"
                icon={AlertSquareFreeIcons}
              />
              <div>
                <CardTitle>Overdue Loans</CardTitle>
                <CardDescription>
                  {overdue.length} total overdue loans
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {overdue.map((inst) => {
              const index =
                inst.loan.installments.findIndex((i) => i.id === inst.id) + 1

              return (
                <Card key={inst.id}>
                  <CardHeader>
                    <CardTitle>{inst.loan.borrower.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <p>{inst.loan.purpose}</p>
                        <Separator orientation="vertical" />
                        <p>
                          Installment {index}/{inst.loan.numberOfPayments}
                        </p>
                      </div>
                    </CardDescription>
                    <CardAction>
                      <RecordPaymentDrawer
                        isDue
                        loanId={inst.loanId}
                        installmentId={inst.id}
                        amount={inst.amount}
                        borrowerName={inst.loan.borrower.name}
                        installmentLabel={`${index}/${inst.loan.numberOfPayments}`}
                      />
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight text-destructive">
                      {money.format(money.fromCents(inst.amount))}
                    </p>
                    <p className="text-muted-foreground">
                      Due {inst.dueDate.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      </section>
      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Clock02FreeIcons} />
              <div>
                <CardTitle>Collection History</CardTitle>
                <CardDescription>
                  View all of your collection record
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PaymentRecordsTable paymentsPromise={payments} />
          </CardContent>
        </Card>
      </section>
    </section>
  )
}
