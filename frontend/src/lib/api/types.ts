export interface CustomerDTO {
  id: number;
  firstName: string;
  lastName: string;
  accountNumber: string;
  balance: number;
}

export interface TransactionDTO {
  id: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  /** LocalDateTime en formato ISO, ej: 2026-09-04T10:15:30 */
  timestamp: string;
}

export interface TransferRequestDTO {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
}

export type CreateCustomerRequest = Omit<CustomerDTO, "id">;
