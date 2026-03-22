import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AutoRefresh } from "@/components/util/AutoRefresh"
import { IncidentLevel } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import {
  Alert01FreeIcons,
  InformationSquareFreeIcons,
  ServerStack01FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import AiAuditSummary from "./components/AiAuditSummary"

export default async function page() {
  const data = await prisma.auditTrail.findMany({
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { name: true } } },
  })

  return (
    <>
      <section className="px-8 pt-8">
        <AiAuditSummary />
      </section>
      <section className="p-8">
        <AutoRefresh />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={ServerStack01FreeIcons} />
              <div>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>
                  Immutable log of all activities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data.map((d) => (
              <ActivityCard key={d.id} data={d} />
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function ActivityCard({
  data,
}: {
  data: {
    actor: {
      name: string
    }
  } & {
    id: string
    incident: string
    incidentLevel: IncidentLevel
    createdAt: Date
    actorId: string
    details: string
    ipAddress: string
  }
}) {
  return (
    <Card>
      <CardHeader>
        {data.incidentLevel === "INFO" ? (
          <CardTitle>
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={InformationSquareFreeIcons} />
              <p>{data.incident}</p>
            </div>
          </CardTitle>
        ) : (
          <CardTitle>
            <div className="flex items-center gap-3">
              <HugeiconsIcon
                className="text-destructive"
                icon={Alert01FreeIcons}
              />
              <p className="text-destructive">{data.incident}</p>
            </div>
          </CardTitle>
        )}
        <CardDescription>{data.createdAt.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Actor: <span className="text-foreground">{data.actor.name}</span>
        </p>
        <p className="text-muted-foreground">
          Actor ID: <span className="text-foreground">{data.actorId}</span>
        </p>
        <div className="my-4 rounded-lg border border-border bg-input px-4 py-3">
          <p className="text-pretty">{data.details}</p>
        </div>
        <Separator />
        <div className="mt-2 flex items-center gap-2">
          <HugeiconsIcon
            className="text-muted-foreground"
            icon={ServerStack01FreeIcons}
            size={16}
          />
          <p className="text-muted-foreground">IP Address: {data.ipAddress}</p>
          <Separator orientation="vertical" />
          <p className="text-muted-foreground">Audit ID: {data.id}</p>
        </div>
      </CardContent>
    </Card>
  )
}
