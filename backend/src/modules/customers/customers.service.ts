import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createCustomer,
  deleteCustomer,
  findCustomerByEmail,
  findCustomerById,
  findCustomers,
  getCustomerOrderAggregates,
  getCustomerSummary,
  listCustomerEmails,
  updateCustomer,
  type CustomerOrderAggregate,
} from "./customers.repository.js";
import type { CreateCustomerInput, UpdateCustomerInput } from "./customers.schema.js";

const EMPTY_STATS: CustomerOrderAggregate = { email: "", orderCount: 0, totalSpent: 0, lastOrderAt: null };

export async function addCustomer(businessId: string, input: CreateCustomerInput) {
  const existing = await findCustomerByEmail(businessId, input.email);
  if (existing) throw new ConflictError("A customer with this email already exists");

  return createCustomer({
    businessId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    status: input.status ?? "active",
    tags: input.tags,
    notes: input.notes,
  });
}

export async function listCustomers(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const [{ items, total }, aggregates] = await Promise.all([
    findCustomers(businessId, query.status, query.search, pagination.limit, pagination.offset),
    getCustomerOrderAggregates(businessId),
  ]);

  const aggregateByEmail = new Map(aggregates.map((a) => [a.email, a]));
  const withStats = items.map((customer) => {
    const stats = aggregateByEmail.get(customer.email) ?? EMPTY_STATS;
    return {
      ...customer,
      orderCount: stats.orderCount,
      totalSpent: stats.totalSpent,
      lastOrderAt: stats.lastOrderAt,
    };
  });

  return paginatedResult(withStats, total, pagination);
}

export async function getCustomer(businessId: string, id: string) {
  const customer = await findCustomerById(businessId, id);
  if (!customer) throw new NotFoundError("Customer not found");

  const aggregates = await getCustomerOrderAggregates(businessId);
  const stats = aggregates.find((a) => a.email === customer.email) ?? EMPTY_STATS;

  return { ...customer, orderCount: stats.orderCount, totalSpent: stats.totalSpent, lastOrderAt: stats.lastOrderAt };
}

export async function editCustomer(businessId: string, id: string, input: UpdateCustomerInput) {
  await getCustomer(businessId, id);

  if (input.email) {
    const existing = await findCustomerByEmail(businessId, input.email);
    if (existing && existing.id !== id) throw new ConflictError("A customer with this email already exists");
  }

  await updateCustomer(businessId, id, input);
  return getCustomer(businessId, id);
}

export async function removeCustomer(businessId: string, id: string) {
  await getCustomer(businessId, id);
  await deleteCustomer(businessId, id);
}

export async function getCustomerStats(businessId: string) {
  const [summary, aggregates, emails] = await Promise.all([
    getCustomerSummary(businessId),
    getCustomerOrderAggregates(businessId),
    listCustomerEmails(businessId),
  ]);

  const emailSet = new Set(emails);
  let totalSpent = 0;
  let returningCustomers = 0;

  for (const row of aggregates) {
    if (!emailSet.has(row.email)) continue;
    totalSpent += row.totalSpent;
    if (row.orderCount >= 2) returningCustomers += 1;
  }

  return {
    totalCustomers: summary?.totalCustomers ?? 0,
    activeCustomers: summary?.activeCustomers ?? 0,
    newCustomers: summary?.newCustomers ?? 0,
    returningCustomers,
    totalSpent,
  };
}
