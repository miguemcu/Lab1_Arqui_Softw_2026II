import { ENDPOINTS } from "@/config/api";
import { apiFetch } from "./client";
import type {
  CreateCustomerRequest,
  CustomerDTO,
  TransactionDTO,
  TransferRequestDTO,
} from "./types";

export const bankApi = {
  getCustomers: () => apiFetch<CustomerDTO[]>(ENDPOINTS.customers()),

  getCustomerById: (id: number | string) => apiFetch<CustomerDTO>(ENDPOINTS.customerById(id)),

  createCustomer: (payload: CreateCustomerRequest) =>
    apiFetch<CustomerDTO>(ENDPOINTS.createCustomer(), {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  transfer: (payload: TransferRequestDTO) =>
    apiFetch<TransactionDTO>(ENDPOINTS.transfer(), {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getTransactionsByAccount: (accountNumber: string) =>
    apiFetch<TransactionDTO[]>(ENDPOINTS.transactionsByAccount(accountNumber)),
};
