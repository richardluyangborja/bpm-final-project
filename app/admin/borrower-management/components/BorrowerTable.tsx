"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Delete01FreeIcons } from "@hugeicons/core-free-icons"
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
import { use, useMemo, useState } from "react"
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
import { deleteBorrowerAction } from "../actions/delete-borrower-action"

export default function BorrowerTable({
  data,
}: {
  data: Promise<
    {
      id: string
      email: string
      name: string
      contact: string | null
      address: string | null
      loans: {
        id: string
      }[]
    }[]
  >
}) {
  const borrowers = use(data)
  const [search, setSearch] = useState("")

  const filteredBorrowers = useMemo(() => {
    const query = search.toLowerCase()

    return borrowers.filter((b) => {
      return (
        b.name.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.contact?.toLowerCase().includes(query) ||
        b.address?.toLowerCase().includes(query)
      )
    })
  }, [borrowers, search])

  return (
    <section>
      <Table>
        <TableCaption>A list of all registered borrowers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Loans</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBorrowers.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.email}</TableCell>
              <TableCell>{b.contact}</TableCell>
              <TableCell>{b.address}</TableCell>
              <TableCell>{b.loans.length}</TableCell>
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
                          const result = await deleteBorrowerAction(b.id)
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
