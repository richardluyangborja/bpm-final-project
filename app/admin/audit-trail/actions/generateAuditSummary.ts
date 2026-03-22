"use server"

import prisma from "@/lib/prisma"
import { DateTime } from "luxon"
import { googleGenAi } from "@/lib/google-gen-ai"

type Range = "today" | "7days" | "30days"

export async function generateAuditSummary(range: Range) {
  const now = DateTime.now()

  let fromDate: DateTime

  if (range === "today") {
    fromDate = now.startOf("day")
  } else if (range === "7days") {
    fromDate = now.minus({ days: 7 })
  } else {
    fromDate = now.minus({ days: 30 })
  }

  const logs = await prisma.auditTrail.findMany({
    where: {
      createdAt: {
        gte: fromDate.toJSDate(),
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { name: true } },
    },
  })

  if (!logs.length) {
    return "No audit trail data found for the selected period."
  }

  const formattedLogs = logs
    .map((log) => {
      return `
[${DateTime.fromJSDate(log.createdAt).toFormat("ff")}]
Actor: ${log.actor.name}
Level: ${log.incidentLevel}
Incident: ${log.incident}
Details: ${log.details}
IP: ${log.ipAddress}
      `
    })
    .join("\n")

  const prompt = `
You are an expert compliance officer generating a formal audit report.

System:
Kolekta - A microfinance system for monitoring field collectors and ensuring transparency of payments.

Task:
Generate a professional audit trail report based on the logs below.

Requirements:
- Write in a formal and structured tone
- Identify key patterns, anomalies, and risks
- Highlight any suspicious or dangerous activities
- Summarize operational behavior of collectors
- Provide insights, not just summaries
- Include recommendations if necessary
- Do not add formatting like a markdown, keep it plain text.
- Do not add date of report.

Format:
1. Overview
2. Key Activities
3. Incidents & Risks
4. Observations
5. Recommendations
6. Conclusion

Audit Logs:
${formattedLogs}
  `

  const response = await googleGenAi(prompt)

  return response
}
