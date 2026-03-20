"use client"

import { recordPaymentAction } from "../actions/record-payment-action"
import { money } from "@/lib/money"
import { useForm } from "@tanstack/react-form"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Field } from "@/components/ui/field"
import { toast } from "sonner"

export default function RecordPaymentDrawer({
  loanId,
  installmentId,
  amount,
  borrowerName,
  installmentLabel,
  dueDate,
  isDue,
}: {
  loanId: string
  installmentId: string
  amount: number
  borrowerName: string
  installmentLabel: string
  dueDate?: Date
  isDue?: boolean
}) {
  const form = useForm({
    defaultValues: {
      note: "",
    },
    onSubmit: async ({ value }) => {
      const result = await recordPaymentAction({
        loanId,
        installmentId,
        amount,
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
        <Button variant={isDue ? "destructive" : "default"}>
          Record Payment
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
            <DrawerTitle>Record Payment</DrawerTitle>
            <DrawerDescription>
              This will record a payment permanently.
            </DrawerDescription>
          </DrawerHeader>

          {/* Info */}
          <section className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>{borrowerName}</CardTitle>
                <CardDescription>
                  Installment {installmentLabel}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p
                  className={`text-xl font-semibold ${
                    isDue ? "text-destructive" : "text-emerald-400"
                  }`}
                >
                  {money.format(money.fromCents(amount))}
                </p>

                {dueDate && (
                  <p className="text-muted-foreground">
                    Due {new Date(dueDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Note */}
          <section className="px-4">
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
              <form.Subscribe selector={(state) => state.isSubmitting}>
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
