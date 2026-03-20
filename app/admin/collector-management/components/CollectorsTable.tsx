"use client"

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
import { money } from "@/lib/money"
import { Delete01FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { use } from "react"
import { deleteCollectorAction } from "../actions/delete-collector-action"
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
import { toast } from "sonner"

export default function CollectorsTable({
  data,
}: {
  data: Promise<
    {
      id: string
      user: {
        name: string
        email: string
      }
      payments: {
        amount: number
        createdAt: Date
      }[]
    }[]
  >
}) {
  const collectors = use(data)

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const collectorsSummary = collectors.map((collector) => {
    const summary = collector.payments.reduce(
      (acc, payment) => {
        acc.totalCollection += payment.amount
        acc.totalTransactions += 1

        if (payment.createdAt >= startOfToday) {
          acc.todayCollection += payment.amount
          acc.todayTransactions += 1
        }

        return acc
      },
      {
        totalCollection: 0,
        totalTransactions: 0,
        todayCollection: 0,
        todayTransactions: 0,
      }
    )

    return {
      id: collector.id,
      user: collector.user,
      ...summary,
    }
  })

  return (
    <section>
      <Table>
        <TableCaption>A list of all registered collectors.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Collection</TableHead>
            <TableHead>Today</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectorsSummary.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.user.name}</TableCell>
              <TableCell>{c.user.email}</TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">
                    {money.format(money.fromCents(c.totalCollection))}
                  </p>
                  <p className="text-muted-foreground">
                    {c.totalTransactions} transactions
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">
                    {money.format(money.fromCents(c.todayCollection))}
                  </p>
                  <p className="text-muted-foreground">
                    {c.todayTransactions} transactions
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <HugeiconsIcon icon={Delete01FreeIcons} />
                      Delete account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={async () => {
                          const result = await deleteCollectorAction(c.id)
                          if (result?.success) toast.info(result.message)
                        }}
                      >
                        Yes, delete this account.
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
