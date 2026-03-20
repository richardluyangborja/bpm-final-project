"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Delete01FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import InstallmentScheduleDialog from "./InstallmentScheduleDialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { use } from "react"
import { money } from "@/lib/money"
import { deleteLoanAction } from "../actions/delete-loan-action"
import { toast } from "sonner"
import { InstallmentStatus, PaymentFrequency } from "@/generated/prisma/enums"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LoanTable({
  data,
}: {
  data: Promise<
    {
      id: string
      purpose: string | null
      principalAmount: number
      interest: number
      totalBalance: number
      paymentFrequency: PaymentFrequency
      numberOfPayments: number
      borrower: { name: string }
      installments: {
        id: string
        amount: number
        status: InstallmentStatus
        dueDate: Date
        payment: {
          createdAt: Date
        } | null
      }[]
    }[]
  >
}) {
  const loans = use(data)

  return (
    <section>
      <Table>
        <TableCaption>A list of all loans and payment schedules.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Borrower</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loans.map((loan) => {
            const paid = loan.installments.filter(
              (i) => i.status === "PAID"
            ).length
            const total = loan.installments.length
            const progress = total === 0 ? 0 : Math.round((paid / total) * 100)

            const status =
              progress === 100
                ? "paid"
                : loan.installments.some((i) => i.status === "OVERDUE")
                  ? "overdue"
                  : "active"

            return (
              <TableRow key={loan.id}>
                <TableCell>{loan.borrower.name}</TableCell>
                <TableCell>{loan.purpose ?? "--"}</TableCell>

                <TableCell>
                  <p className="text-sm">
                    {money.format(money.fromCents(loan.principalAmount))}
                  </p>
                  <p className="text-muted-foreground">
                    {loan.interest}% interest
                  </p>
                </TableCell>

                <TableCell className="text-sm font-semibold text-emerald-400">
                  {money.format(money.fromCents(loan.totalBalance))}
                </TableCell>

                <TableCell>
                  <Badge variant="outline">{loan.paymentFrequency}</Badge>
                  <p className="text-muted-foreground">
                    {loan.numberOfPayments} installments
                  </p>
                </TableCell>

                <TableCell>
                  <p className="text-sm">{progress}%</p>
                  <p className="text-muted-foreground">
                    {paid}/{total} paid
                  </p>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      status === "paid"
                        ? "default"
                        : status === "overdue"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <InstallmentScheduleDialog
                      loan={{
                        id: loan.id,
                        borrowerName: loan.borrower.name,
                        principalAmount: loan.principalAmount,
                        interestRate: loan.interest,
                        paymentFrequency: loan.paymentFrequency,
                        totalBalance: loan.totalBalance,
                      }}
                      installments={loan.installments.map((i) => {
                        return {
                          id: i.id,
                          amount: i.amount,
                          dueDate: i.dueDate,
                          paidDate: i.payment?.createdAt,
                        }
                      })}
                    />
                    <Separator orientation="vertical" />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <HugeiconsIcon icon={Delete01FreeIcons} />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this loan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the loan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={async () => {
                              const result = await deleteLoanAction(loan.id)
                              if (result?.success) toast.info(result.message)
                            }}
                          >
                            Yes, delete this loan.
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}
