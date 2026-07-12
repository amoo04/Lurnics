import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import {
  createInvoiceWithLineItems,
  deleteInvoice,
  findInvoiceByNumber,
  findInvoiceById,
  findInvoices,
  updateInvoiceWithLineItems,
} from "./invoices.repository.js";
import type { CreateInvoiceInput, UpdateInvoiceInput } from "./invoices.schema.js";

export async function listInvoices(query: {
  page?: string;
  limit?: string;
  status?: string;
  clientId?: string;
  search?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findInvoices(
    query.status,
    query.clientId,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getInvoice(id: string) {
  const invoice = await findInvoiceById(id);
  if (!invoice) throw new NotFoundError("Invoice not found");
  return invoice;
}

export async function addInvoice(userId: string, input: CreateInvoiceInput) {
  const existing = await findInvoiceByNumber(input.invoiceNumber);
  if (existing) throw new ConflictError("Invoice with this number already exists");

  const { lineItems, ...rest } = input;
  const invoice = await createInvoiceWithLineItems(rest, lineItems);
  await logActivity(userId, "create", "invoice", invoice.id);
  return invoice;
}

export async function editInvoice(userId: string, id: string, input: UpdateInvoiceInput) {
  await getInvoice(id);
  const { lineItems, ...rest } = input;
  const invoice = await updateInvoiceWithLineItems(id, rest, lineItems);
  await logActivity(userId, "update", "invoice", id);
  return invoice;
}

export async function removeInvoice(userId: string, id: string) {
  await getInvoice(id);
  await deleteInvoice(id);
  await logActivity(userId, "delete", "invoice", id);
}
