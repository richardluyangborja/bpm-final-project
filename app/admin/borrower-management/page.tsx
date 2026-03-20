import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { File01FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import BorrowerTable from "./components/BorrowerTable"
import CreateBorrowerButton from "./components/CreateBorrowerButton"
import prisma from "@/lib/prisma"
import { AutoRefresh } from "@/components/util/AutoRefresh"

export default function page() {
  const borrowerData = prisma.borrower.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      contact: true,
      address: true,
      loans: {
        select: {
          id: true,
        },
      },
    },
  })

  return (
    <section className="p-8">
      <AutoRefresh />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={File01FreeIcons} />
            <div>
              <CardTitle>Borrower Management</CardTitle>
              <CardDescription>
                View and manage all registered borrowers
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <CreateBorrowerButton />
          </CardAction>
        </CardHeader>
        <CardContent>
          <BorrowerTable data={borrowerData} />
        </CardContent>
      </Card>
    </section>
  )
}
