import { ConflictError, NotFoundError, ValidationError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import { sendEmail, emailFrom } from "../../lib/email.js";
import { clientMessageEmail } from "../../lib/email-templates.js";
import {
  createClient,
  findClientByEmail,
  findClientById,
  findClients,
  softDeleteClient,
  updateClient,
} from "./clients.repository.js";
import type { CreateClientInput, SendClientEmailInput, UpdateClientInput } from "./clients.schema.js";

export async function listClients(query: {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findClients(
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getClient(id: string) {
  const client = await findClientById(id);
  if (!client) throw new NotFoundError("Client not found");
  return client;
}

export async function addClient(userId: string, input: CreateClientInput) {
  if (input.email) {
    const existing = await findClientByEmail(input.email);
    if (existing) throw new ConflictError("Client with this email already exists");
  }

  const client = await createClient({ ...input, status: input.status ?? "active" });
  await logActivity(userId, "create", "client", client.id);
  return client;
}

export async function editClient(userId: string, id: string, input: UpdateClientInput) {
  await getClient(id);
  const client = await updateClient(id, input);
  await logActivity(userId, "update", "client", id);
  return client;
}

export async function removeClient(userId: string, id: string) {
  await getClient(id);
  await softDeleteClient(id);
  await logActivity(userId, "delete", "client", id);
}

export async function sendClientEmail(userId: string, id: string, input: SendClientEmailInput) {
  const client = await getClient(id);
  if (!client.email) {
    throw new ValidationError("This client has no email address on file");
  }

  const message = clientMessageEmail({
    type: input.type,
    contactPerson: client.contactPerson,
    subject: input.subject,
    body: input.body,
    ctaLabel: input.ctaLabel,
    ctaUrl: input.ctaUrl,
  });

  const result = await sendEmail({
    from: emailFrom(),
    to: client.email,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });

  await logActivity(userId, "email", "client", id);
  return result;
}
