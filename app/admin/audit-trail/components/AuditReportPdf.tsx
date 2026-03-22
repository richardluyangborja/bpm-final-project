import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 20 },
  text: { fontSize: 10, lineHeight: 1.5 },
})

export function AuditReportPdf({ content }: { content: string }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.text}>{content}</Text>
      </Page>
    </Document>
  )
}
