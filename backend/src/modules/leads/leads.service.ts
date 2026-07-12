import { getResend, LEADS_EMAIL_FROM } from "../../lib/email.js";
import { AppError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import {
  createLead,
  deleteLead,
  findLeadById,
  findLeads,
  updateLeadStatus,
} from "./leads.repository.js";
import type { CreateLeadInput, UpdateLeadInput } from "./leads.schema.js";

export interface SendLeadEmailInput {
  to: string;
  subject: string;
  body: string;
}

export async function submitLead(input: CreateLeadInput) {
  return createLead({ ...input, source: input.source ?? "website" });
}

export async function listLeads(query: { page?: string; limit?: string; status?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findLeads(query.status, pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getLead(id: string) {
  const lead = await findLeadById(id);
  if (!lead) throw new NotFoundError("Lead not found");
  return lead;
}

export async function changeLeadStatus(userId: string, id: string, input: UpdateLeadInput) {
  await getLead(id);
  const lead = await updateLeadStatus(id, input.status);
  await logActivity(userId, "update", "lead", id);
  return lead;
}

export async function removeLead(userId: string, id: string) {
  await getLead(id);
  await deleteLead(id);
  await logActivity(userId, "delete", "lead", id);
}

export async function sendLeadEmail({ to, subject, body }: SendLeadEmailInput) {
  let resend;
  try {
    resend = getResend();
  } catch {
    throw new AppError("Email sending is not configured on the server yet", 503, "EMAIL_NOT_CONFIGURED");
  }

  const { data, error } = await resend.emails.send({
    from: LEADS_EMAIL_FROM,
    to,
    subject,
    text: body,
  });

  if (error) {
    throw new AppError(error.message, 502, "EMAIL_SEND_FAILED");
  }

  return { id: data?.id };
}
