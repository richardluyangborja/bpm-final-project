"use client"

import { PlusSignFreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { createLoanAction } from "../actions/create-loan-action"

const formSchema = z.object({
  borrowerId: z.string(),
  purpose: z.string(),
  principal: z.number().min(1),
  interestRate: z.number().min(0),
  numberOfPayments: z.number().min(1),
  paymentFrequency: z.enum(["WEEKLY", "MONTHLY"]),
  startDate: z.string(),
})

export default function CreateLoanButton({
  borrowers,
}: {
  borrowers: { id: string; name: string }[]
}) {
  const form = useForm({
    defaultValues: {
      borrowerId: "",
      purpose: "",
      principal: 0,
      interestRate: 0,
      numberOfPayments: 1,
      paymentFrequency: "MONTHLY" as "MONTHLY" | "WEEKLY",
      startDate: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await createLoanAction(value)
      if (!result?.success) toast.error(result?.message)
      if (result?.success) {
        toast.success(result.message)
        form.reset()
      }
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <HugeiconsIcon icon={PlusSignFreeIcons} />
          Create new loan
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Loan</DialogTitle>
          <DialogDescription>Enter loan details below</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            {/* Borrower */}
            <form.Field name="borrowerId">
              {(field) => (
                <Field>
                  <FieldLabel>Borrower</FieldLabel>
                  <select
                    className="rounded-md border p-2"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="">Select borrower</option>
                    {borrowers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </form.Field>

            {/* Purpose */}
            <form.Field name="purpose">
              {(field) => (
                <Field>
                  <FieldLabel>Purpose</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            {/* Principal */}
            <form.Field name="principal">
              {(field) => (
                <Field>
                  <FieldLabel>Principal (₱)</FieldLabel>
                  <Input
                    type="number"
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </Field>
              )}
            </form.Field>

            {/* Interest */}
            <form.Field name="interestRate">
              {(field) => (
                <Field>
                  <FieldLabel>Interest (%)</FieldLabel>
                  <Input
                    type="number"
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </Field>
              )}
            </form.Field>

            {/* Payments */}
            <form.Field name="numberOfPayments">
              {(field) => (
                <Field>
                  <FieldLabel>Number of Installments</FieldLabel>
                  <Input
                    type="number"
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </Field>
              )}
            </form.Field>

            {/* Frequency */}
            <form.Field name="paymentFrequency">
              {(field) => (
                <Field>
                  <FieldLabel>Frequency</FieldLabel>
                  <select
                    className="rounded-md border p-2"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value as "WEEKLY" | "MONTHLY")
                    }
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </Field>
              )}
            </form.Field>

            {/* Start Date */}
            <form.Field name="startDate">
              {(field) => (
                <Field>
                  <FieldLabel>Start Date</FieldLabel>
                  <Input
                    type="date"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <Field>
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) =>
                  isSubmitting ? (
                    <Button disabled>
                      <Spinner />
                      Loading...
                    </Button>
                  ) : (
                    <Button type="submit">Confirm</Button>
                  )
                }
              </form.Subscribe>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
