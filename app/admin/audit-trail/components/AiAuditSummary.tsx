"use client"

import { useState, useTransition } from "react"
import { generateAuditSummary } from "../actions/generateAuditSummary"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PDFDownloadLink } from "@react-pdf/renderer"
import { AuditReportPdf } from "./AuditReportPdf"

export default function AiAuditSummary() {
  const [range, setRange] = useState<"today" | "7days" | "30days">("today")
  const [result, setResult] = useState("")
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateAuditSummary(range)
      setResult(res || "No response")
      setOpen(true)
    })
  }

  return (
    <div className="flex items-center gap-4">
      <Select
        defaultValue="today"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onValueChange={(v) => setRange(v as any)}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7days">Last 7 Days</SelectItem>
          <SelectItem value="30days">Last 30 Days</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleGenerate} disabled={pending}>
        {pending ? "Generating report..." : "Generate AI Report"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild />
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-auto">
          <DialogHeader>
            <DialogTitle>AI Audit Report</DialogTitle>
          </DialogHeader>

          <PDFDownloadLink
            document={<AuditReportPdf content={result} />}
            fileName="audit-report.pdf"
          >
            {({ loading }) => (
              <Button variant="outline">
                {loading ? "Preparing PDF..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>

          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </DialogContent>
      </Dialog>
    </div>
  )
}
