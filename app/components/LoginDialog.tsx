"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight02FreeIcons,
  InformationSquareFreeIcons,
} from "@hugeicons/core-free-icons"
import { HoverBorderGradient } from "@/components/aceternity-ui/hover-border-gradient"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { loginAction } from "../actions/login-action"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  email: z.email({ message: "Enter a valid email." }),
  password: z.string({ message: "Enter a valid password." }),
})

export default function LoginDialog() {
  const [error, setError] = useState<string | undefined>(undefined)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await loginAction(value)
      if (!result?.success) setError(result?.message)
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="mx-auto my-20 flex justify-center text-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="flex items-center space-x-2 bg-white text-black dark:bg-black dark:text-white"
          >
            <span>Login to Kolekta</span>
            <HugeiconsIcon icon={ArrowRight02FreeIcons} />
          </HoverBorderGradient>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to your account</DialogTitle>
          <DialogDescription>
            Enter your email below to login to your account
          </DialogDescription>
          {error && (
            <Alert variant="destructive">
              <HugeiconsIcon icon={InformationSquareFreeIcons} />
              <AlertTitle>Login unsuccessful!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
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
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      {/* <a */}
                      {/*   href="#" */}
                      {/*   className="ml-auto inline-block text-sm underline-offset-4 hover:underline" */}
                      {/* > */}
                      {/*   Forgot your password? */}
                      {/* </a> */}
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
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
                    <Button type="submit">Login</Button>
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
