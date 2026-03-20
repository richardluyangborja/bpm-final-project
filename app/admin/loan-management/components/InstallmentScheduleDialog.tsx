import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowUpRight01FreeIcons,
  Calendar04FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { money } from "@/lib/money"

type Installment = {
  id: string
  amount: number // cents
  dueDate: Date
  paidDate: Date | null | undefined
}

type Loan = {
  id: string
  borrowerName: string
  principalAmount: number
  interestRate: number
  paymentFrequency: "WEEKLY" | "MONTHLY"
  totalBalance: number
}

function getStatus(inst: Installment) {
  if (inst.paidDate) return "PAID"

  const now = new Date()
  if (new Date(inst.dueDate) < now) return "OVERDUE"

  return "PENDING"
}

export default function InstallmentScheduleDialog({
  loan,
  installments,
}: {
  loan: Loan
  installments: Installment[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          View installments
          <HugeiconsIcon icon={ArrowUpRight01FreeIcons}></HugeiconsIcon>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Calendar04FreeIcons} />
            <DialogTitle>Loan Installment Schedule</DialogTitle>
          </div>
          <DialogDescription>{loan.borrowerName}&apos;s loan</DialogDescription>
        </DialogHeader>
        <section className="flex items-center justify-evenly rounded-lg bg-secondary py-3">
          <div>
            <p className="text-xs text-muted-foreground">Principal</p>
            <p className="font-medium">
              {money.format(money.fromCents(loan.principalAmount))}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Interest Rate</p>
            <p className="font-medium">{loan.interestRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Schedule</p>
            <p className="font-medium">{loan.paymentFrequency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="font-medium text-emerald-400">
              {money.format(money.fromCents(loan.totalBalance))}
            </p>
          </div>
        </section>
        <section>
          <ScrollArea className="h-96">
            <Table>
              <TableCaption>
                A list of {loan.borrowerName}&apos;s loan installments.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installments.map((inst, i) => {
                  const status = getStatus(inst)

                  return (
                    <TableRow key={inst.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {money.format(money.fromCents(inst.amount))}
                      </TableCell>
                      <TableCell>
                        {new Date(inst.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {inst.paidDate
                          ? new Date(inst.paidDate).toLocaleDateString()
                          : "--"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "PAID"
                              ? "default"
                              : status === "OVERDUE"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </section>
      </DialogContent>
    </Dialog>
  )
}
