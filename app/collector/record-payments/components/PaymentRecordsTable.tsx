"use client"

import { Button } from "@/components/ui/button"
import {
  ReceiptTextFreeIcons,
  StickyNote02FreeIcons,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer"
import { ReceiptDocument } from "./ReceiptDocument"
import { format } from "date-fns"
import { money } from "@/lib/money"
import { use } from "react"

export default function PaymentRecordsTable({
  paymentsPromise,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentsPromise: Promise<any>
}) {
  const payments = use(paymentsPromise)

  return (
    <section>
      <Table>
        <TableCaption>A list of all payment records.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date and Time</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {payments.map((p: any) => (
            <TableRow key={p.id}>
              <TableCell>
                <div>
                  <p suppressHydrationWarning className="text-sm">
                    {format(p.createdAt, "M/d/yyyy")}
                  </p>
                  <p suppressHydrationWarning className="text-muted-foreground">
                    {format(p.createdAt, "hh:mm a")}
                  </p>
                </div>
              </TableCell>

              <TableCell>{p.loan.borrower.name}</TableCell>

              <TableCell>{p.loan.purpose ?? "—"}</TableCell>

              <TableCell className="text-sm font-semibold text-emerald-400">
                {money.format(money.fromCents(p.amount))}
              </TableCell>

              <TableCell>
                <div className="flex gap-3">
                  <ViewNotes notes={p.notes} />
                  <ViewReceipt payment={p} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

function ViewNotes({ notes }: { notes?: string | null }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon icon={StickyNote02FreeIcons} />
          View Notes
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Notes</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {notes || "No notes provided."}
        </p>
      </DialogContent>
    </Dialog>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ViewReceipt({ payment }: { payment: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon icon={ReceiptTextFreeIcons} />
          View Receipt
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="h-125">
          <PDFViewer width="100%" height="100%">
            <ReceiptDocument payment={payment} />
          </PDFViewer>
        </div>

        {/* Download */}
        <PDFDownloadLink
          document={<ReceiptDocument payment={payment} />}
          fileName={`receipt-${payment.id}.pdf`}
        >
          {({ loading }) => (
            <Button>{loading ? "Generating..." : "Download PDF"}</Button>
          )}
        </PDFDownloadLink>
      </DialogContent>
    </Dialog>
  )
}
