export function formatCurrency(amount: string | number) {
  const value = typeof amount === "string" ? Number(amount) : amount
  if (!Number.isFinite(value)) return "-"
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
}
