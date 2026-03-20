import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { File01FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import LoanTable from "./components/LoanTable"
import prisma from "@/lib/prisma"
import CreateLoanButton from "./components/CreateLoanButton"
import { AutoRefresh } from "@/components/util/AutoRefresh"

export default async function page() {
  const loanData = prisma.loan.findMany({
    select: {
      id: true,
      purpose: true,
      principalAmount: true,
      totalBalance: true,
      interest: true,
      paymentFrequency: true,
      numberOfPayments: true,
      borrower: {
        select: {
          name: true,
        },
      },
      installments: {
        select: {
          id: true,
          amount: true,
          status: true,
          dueDate: true,
          payment: {
            select: {
              createdAt: true,
            },
          },
        },
      },
    },
  })

  const borrowers = prisma.borrower.findMany({
    select: { id: true, name: true },
  })

  return (
    <section className="p-8">
      <AutoRefresh />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={File01FreeIcons} />
            <div>
              <CardTitle>Loan Management</CardTitle>
              <CardDescription>
                View and manage all loans and payment schedules
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <CreateLoanButton borrowers={await borrowers} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <LoanTable data={loanData} />
        </CardContent>
      </Card>
    </section>
  )
}
