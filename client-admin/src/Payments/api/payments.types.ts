export type PaymentStatus = "pending" | "completed" | "failed";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string | null;
  paymentDate: string;
  status: PaymentStatus;
  invoice?: {
    id: string;
    invoiceNumber: string;
    client?: { companyName: string } | null;
    project?: { projectName: string } | null;
  } | null;
}

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  paymentDate: string;
  status: PaymentStatus;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
