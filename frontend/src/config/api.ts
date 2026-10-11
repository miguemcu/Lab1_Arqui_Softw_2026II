/**
 * Configuración central de la API de UdeA Bank.
 *
 */
export const BASE_URL: string =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:8088";

export const ENDPOINTS = {
  /** GET todos los clientes */
  customers: () => `/api/customers`,
  /** GET un cliente por id */
  customerById: (id: number | string) => `/api/customers/${id}`,
  /** POST crear cliente */
  createCustomer: () => `/api/customers`,
  /** POST transferir dinero entre cuentas */
  transfer: () => `/api/transactions`,
  /** GET transacciones por número de cuenta */
  transactionsByAccount: (accountNumber: string) =>
    `/api/transactions/${encodeURIComponent(accountNumber)}`,
} as const;
