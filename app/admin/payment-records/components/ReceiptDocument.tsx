import { money } from "@/lib/money"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0f1115",
    color: "#f4f7f8",
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
  },

  card: {
    backgroundColor: "#1a1d22",
    padding: 20,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f8f8b",
  },

  subtitle: {
    fontSize: 10,
    color: "#a1a8b0",
    marginTop: 4,
  },

  divider: {
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginVertical: 12,
  },

  section: {
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    color: "#a1a8b0",
  },

  value: {
    color: "#f4f7f8",
    fontWeight: "bold",
  },

  amountBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#2f8f8b",
    borderRadius: 6,
    alignItems: "center",
  },

  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 9,
    color: "#a1a8b0",
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReceiptDocument({ payment }: { payment: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Payment Receipt</Text>
            <Text style={styles.subtitle}>Transaction ID: {payment.id}</Text>
          </View>

          <View style={styles.divider} />

          {/* Details */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Borrower</Text>
              <Text style={styles.value}>{payment.loan.borrower.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Collector</Text>
              <Text style={styles.value}>{payment.collector.user.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Purpose</Text>
              <Text style={styles.value}>{payment.loan.purpose ?? "—"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>
                {new Date(payment.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Amount Highlight */}
          <View style={styles.amountBox}>
            <Text style={styles.amountText}>
              {money.format(money.fromCents(payment.amount))}
            </Text>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            This is a system-generated receipt. No signature required.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
