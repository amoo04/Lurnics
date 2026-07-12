export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
}

export interface InvoicePayment {
  id: string;
  amount: number;
  status: string;
  paymentDate: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId: string | null;
  amount: number;
  discount: number;
  tax: number;
  dueDate: string;
  status: InvoiceStatus;
  notes: string | null;
  createdAt: string;
  client?: { id: string; companyName: string; email: string | null; phone: string | null } | null;
  project?: { id: string; projectName: string } | null;
  payments?: InvoicePayment[];
  lineItems?: InvoiceLineItem[];
}

export interface LineItemInput {
  description: string;
  amount: number;
}

export interface CreateInvoiceInput {
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
  discount?: number;
  tax?: number;
  lineItems: LineItemInput[];
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function invoiceTotal(invoice: Invoice): number {
  return invoice.amount - invoice.discount + invoice.tax;
}

export function invoicePaid(invoice: Invoice): number {
  return (invoice.payments ?? []).filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
}
