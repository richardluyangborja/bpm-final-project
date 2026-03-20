"use client"

import { useForm } from "@tanstack/react-form"
import { recordPaymentAction } from "../actions/record-payment-action"
import { money } from "@/lib/money"

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Field } from "@/components/ui/field"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignFreeIcons } from "@hugeicons/core-free-icons"

type Props = {
  borrowers: {
    id: string
    name: string
    loans: {
      id: string
      purpose: string | null
      installments: {
        id: string
        amount: number
        dueDate: Date
      }[]
    }[]
  }[]
}

export default function NewPaymentDrawer({ borrowers }: Props) {
  const form = useForm({
    defaultValues: {
      borrowerId: "",
      loanId: "",
      installmentId: "",
      note: "",
    },
    onSubmit: async ({ value }) => {
      const borrower = borrowers.find((b) => b.id === value.borrowerId)
      const loan = borrower?.loans.find((l) => l.id === value.loanId)
      const installment = loan?.installments.find(
        (i) => i.id === value.installmentId
      )

      if (!loan || !installment) {
        toast.error("Invalid selection")
        return
      }

      const result = await recordPaymentAction({
        loanId: loan.id,
        installmentId: installment.id,
        amount: installment.amount,
        note: value.note,
      })

      if (!result?.success) toast.error(result?.message)
      if (result?.success) {
        toast.success(result.message)
        form.reset()
      }
    },
  })

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <HugeiconsIcon icon={PlusSignFreeIcons} />
          New Payment
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <DrawerHeader>
            <DrawerTitle>New Payment</DrawerTitle>
            <DrawerDescription>
              Select borrower, loan, and installment.
            </DrawerDescription>
          </DrawerHeader>

          <section className="space-y-4 px-4">
            {/* Borrower */}
            <form.Field name="borrowerId">
              {(field) => (
                <select
                  className="w-full rounded border p-2"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)

                    // reset dependent fields
                    form.setFieldValue("loanId", "")
                    form.setFieldValue("installmentId", "")
                  }}
                >
                  <option value="">Select borrower</option>
                  {borrowers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </form.Field>

            {/* Loan */}
            <form.Field name="loanId">
              {(field) => {
                const borrower = borrowers.find(
                  (b) => b.id === form.getFieldValue("borrowerId")
                )

                return (
                  <select
                    className="w-full rounded border p-2"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      form.setFieldValue("installmentId", "")
                    }}
                    disabled={!borrower}
                  >
                    <option value="">Select loan</option>
                    {borrower?.loans.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.purpose ?? "Loan"}
                      </option>
                    ))}
                  </select>
                )
              }}
            </form.Field>

            {/* Installment */}
            <form.Field name="installmentId">
              {(field) => {
                const borrower = borrowers.find(
                  (b) => b.id === form.getFieldValue("borrowerId")
                )
                const loan = borrower?.loans.find(
                  (l) => l.id === form.getFieldValue("loanId")
                )

                return (
                  <select
                    className="w-full rounded border p-2"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={!loan}
                  >
                    <option value="">Select installment</option>
                    {loan?.installments.map((i, idx) => (
                      <option key={i.id} value={i.id}>
                        #{idx + 1} — {money.format(money.fromCents(i.amount))}
                      </option>
                    ))}
                  </select>
                )
              }}
            </form.Field>

            {/* Preview */}
            <form.Subscribe
              selector={(state) => ({
                borrowerId: state.values.borrowerId,
                loanId: state.values.loanId,
                installmentId: state.values.installmentId,
              })}
            >
              {({ borrowerId, loanId, installmentId }) => {
                const borrower = borrowers.find((b) => b.id === borrowerId)
                const loan = borrower?.loans.find((l) => l.id === loanId)
                const installment = loan?.installments.find(
                  (i) => i.id === installmentId
                )

                if (!installment) return null

                return (
                  <div className="text-sm">
                    <p>
                      Amount:{" "}
                      <span className="font-semibold text-emerald-400">
                        {money.format(money.fromCents(installment.amount))}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Due {new Date(installment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )
              }}
            </form.Subscribe>

            {/* Note */}
            <form.Field name="note">
              {(field) => (
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Optional note..."
                />
              )}
            </form.Field>
          </section>

          <DrawerFooter>
            <Field>
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) =>
                  isSubmitting ? (
                    <Button disabled>
                      <Spinner data-icon="inline-start" />
                      Loading...
                    </Button>
                  ) : (
                    <Button type="submit">Confirm Payment</Button>
                  )
                }
              </form.Subscribe>
            </Field>

            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
