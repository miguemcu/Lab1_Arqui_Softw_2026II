import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bankApi } from "@/lib/api/bank";
import type { CreateCustomerRequest, TransferRequestDTO } from "@/lib/api/types";

export const bankKeys = {
  customers: ["customers"] as const,
  customer: (id: number | string) => ["customers", id] as const,
  transactions: (account: string) => ["transactions", account] as const,
};

export function useCustomers() {
  return useQuery({
    queryKey: bankKeys.customers,
    queryFn: bankApi.getCustomers,
    retry: false,
  });
}

export function useCustomer(id: number | null) {
  return useQuery({
    queryKey: bankKeys.customer(id ?? "none"),
    queryFn: () => bankApi.getCustomerById(id as number),
    enabled: id !== null,
    retry: false,
  });
}

export function useTransactions(accountNumber: string | null) {
  return useQuery({
    queryKey: bankKeys.transactions(accountNumber ?? "none"),
    queryFn: () => bankApi.getTransactionsByAccount(accountNumber as string),
    enabled: !!accountNumber,
    retry: false,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerRequest) => bankApi.createCustomer(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: bankKeys.customers }),
  });
}

export function useTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransferRequestDTO) => bankApi.transfer(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bankKeys.customers });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
