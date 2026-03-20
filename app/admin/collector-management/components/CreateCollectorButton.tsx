"use client"

import {
  InformationSquareFreeIcons,
  PlusSignFreeIcons,
} from "@hugeicons/core-free-icons"
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createCollectorAction } from "../actions/create-collector-action"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

const formSchema = z.object({
  fullname: z.string().min(2, { message: "Enter a valid name." }),
  email: z.email({ message: "Enter a valid email." }),
  password: z
    .string({ message: "Enter a valid password." })
    .min(8, { error: "Must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Must contain at least one letter." })
    .regex(/[0-9]/, { error: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Must contain at least one special character.",
    }),
})

export default function CreateCollectorButton() {
  const form = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await createCollectorAction({ ...value })
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
          Register new collector
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new collector</DialogTitle>
          <DialogDescription>
            Enter the collector information below
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="fullname">
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
                    <FieldDescription>
                      The collector will use this to login.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
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
            <Alert>
              <HugeiconsIcon icon={InformationSquareFreeIcons} />
              <AlertTitle>Password must:</AlertTitle>
              <AlertDescription>
                - Be atleast 8 characters long. <br />
                - Contain atleast 1 letter. <br />
                - Contain atleast 1 number. <br />- Contain atleast 1 special
                character.
              </AlertDescription>
            </Alert>
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
              Upon confirmation, this will create a new collector.
            </FieldDescription>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
