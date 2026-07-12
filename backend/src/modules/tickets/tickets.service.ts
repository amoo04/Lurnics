import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createTicket,
  deleteTicket,
  findTicketById,
  findTickets,
  updateTicket,
} from "./tickets.repository.js";
import type { CreateTicketInput, UpdateTicketInput } from "./tickets.schema.js";

export async function listTickets(query: {
  page?: string;
  limit?: string;
  status?: string;
  priority?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findTickets(
    query.status,
    query.priority,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getTicket(id: string) {
  const ticket = await findTicketById(id);
  if (!ticket) throw new NotFoundError("Ticket not found");
  return ticket;
}

export async function addTicket(input: CreateTicketInput) {
  return createTicket({ ...input, status: input.status ?? "open" });
}

export async function editTicket(id: string, input: UpdateTicketInput) {
  await getTicket(id);
  return updateTicket(id, input);
}

export async function removeTicket(id: string) {
  await getTicket(id);
  await deleteTicket(id);
}
