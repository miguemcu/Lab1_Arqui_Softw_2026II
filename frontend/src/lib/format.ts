const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return currencyFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Formatea un LocalDateTime ISO del backend (ej. 2026-09-04T10:15:30). */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

export function fullName(firstName?: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(" ") || "—";
}
