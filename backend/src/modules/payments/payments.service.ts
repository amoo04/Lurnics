import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { findInvoiceById, updateInvoiceWithLineItems } from "../invoices/invoices.repository.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import {
  createPayment,
  deletePayment,
  findPaymentById,
  findPayments,
  updatePayment,
} from "./payments.repository.js";
import type { CreatePaymentInput, UpdatePaymentInput } from "./payments.schema.js";

export async function listPayments(query: {
  page?: string;
  limit?: string;
  status?: string;
  invoiceId?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findPayments(
    query.status,
    query.invoiceId,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getPayment(id: string) {
  const payment = await findPaymentById(id);
  if (!payment) throw new NotFoundError("Payment not found");
  return payment;
}

async function syncInvoiceStatus(invoiceId: string) {
  const invoice = await findInvoiceById(invoiceId);
  if (!invoice) return;

  const paidTotal = invoice.payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalDue = invoice.amount - invoice.discount + invoice.tax;

  if (paidTotal >= totalDue && invoice.status !== "paid") {
    await updateInvoiceWithLineItems(invoiceId, { status: "paid" }, undefined);
  }
}

export async function recordPayment(userId: string, input: CreatePaymentInput) {
  const invoice = await findInvoiceById(input.invoiceId);
  if (!invoice) throw new NotFoundError("Invoice not found");

  const payment = await createPayment(input);
  await logActivity(userId, "create", "payment", payment.id);

  if (input.status === "completed") {
    await syncInvoiceStatus(input.invoiceId);
  }

  return payment;
}

export async function editPayment(userId: string, id: string, input: UpdatePaymentInput) {
  const existing = await getPayment(id);
  const payment = await updatePayment(id, input);
  await logActivity(userId, "update", "payment", id);

  if (input.status === "completed") {
    await syncInvoiceStatus(existing.invoiceId);
  }

  return payment;
}

export async function removePayment(userId: string, id: string) {
  await getPayment(id);
  await deletePayment(id);
  await logActivity(userId, "delete", "payment", id);
}
