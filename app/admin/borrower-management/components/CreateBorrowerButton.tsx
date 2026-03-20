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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createBorrowerAction } from "../actions/create-borrower-action"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, { message: "Enter a valid name." }),
  email: z.email({ message: "Enter a valid email." }),
  contact: z
    .string()
    .regex(/^09\d{9}$/, { message: "Enter a valid mobile number." }),
  address: z.string(),
})

export default function CreateBorrowerButton() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      address: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await createBorrowerAction({ ...value })
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
          Register new borrower
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new borrower</DialogTitle>
          <DialogDescription>
            Enter the borrower information below
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="user@example.com"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="contact">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="09123456789"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="address">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <Field>
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) =>
                  isSubmitting ? (
                    <Button disabled>
                      <Spinner data-icon="inline-start" />
                      Loading...
                    </Button>
                  ) : (
                    <Button type="submit">Confirm</Button>
                  )
                }
              </form.Subscribe>
            </Field>

            <FieldDescription>
              Upon confirmation, this will create a new borrower.
            </FieldDescription>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
