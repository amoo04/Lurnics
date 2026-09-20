import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import { sendEmail, emailFrom } from "../../lib/email.js";
import { maintenanceReminderEmail } from "../../lib/email-templates.js";
import {
  createMaintenance,
  deleteMaintenance,
  findContractsForReminderCheck,
  findMaintenanceById,
  findMaintenanceContracts,
  updateMaintenance,
} from "./maintenance.repository.js";
import type { CreateMaintenanceInput, UpdateMaintenanceInput } from "./maintenance.schema.js";

// Reminders fire roughly weekly starting a month out from the due date, with
// a final nudge on the day itself: 30/23/16/9/2 days before, then day 0.
const REMINDER_DAYS = [30, 23, 16, 9, 2, 0];

function daysUntil(dateStr: string): number {
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const target = new Date(dateStr);
  const targetUtc = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
  return Math.round((targetUtc - todayUtc) / 86_400_000);
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function listMaintenance(query: {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findMaintenanceContracts(
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getMaintenance(id: string) {
  const contract = await findMaintenanceById(id);
  if (!contract) throw new NotFoundError("Maintenance contract not found");
  return contract;
}

export async function addMaintenance(userId: string, input: CreateMaintenanceInput) {
  const contract = await createMaintenance({ ...input, autoReminder: input.autoReminder ?? true });
  await logActivity(userId, "create", "maintenance", contract.id);
  return contract;
}

export async function editMaintenance(userId: string, id: string, input: UpdateMaintenanceInput) {
  const existing = await getMaintenance(id);
  // A changed due date starts a new reminder cycle (e.g. after renewal), so
  // clear the marker rather than let the old cycle's history suppress it.
  const resetReminder = input.expiryDate && input.expiryDate !== existing.expiryDate;
  const contract = await updateMaintenance(id, {
    ...input,
    ...(resetReminder ? { lastReminderSentAt: null } : {}),
  });
  await logActivity(userId, "update", "maintenance", id);
  return contract;
}

export async function removeMaintenance(userId: string, id: string) {
  await getMaintenance(id);
  await deleteMaintenance(id);
  await logActivity(userId, "delete", "maintenance", id);
}

export async function runMaintenanceReminders() {
  const contracts = await findContractsForReminderCheck();
  const today = todayDateString();
  let sent = 0;

  for (const contract of contracts) {
    if (!contract.client.email) continue;

    const remaining = daysUntil(contract.expiryDate);
    if (!REMINDER_DAYS.includes(remaining)) continue;
    if (contract.lastReminderSentAt === today) continue;

    const message = maintenanceReminderEmail({
      contactPerson: contract.client.contactPerson,
      companyName: contract.client.companyName,
      planType: contract.planType,
      amount: contract.amount,
      expiryDate: contract.expiryDate,
      daysUntil: remaining,
    });

    await sendEmail({
      from: emailFrom(),
      to: contract.client.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    await updateMaintenance(contract.id, { lastReminderSentAt: today });
    sent += 1;
  }

  return { checked: contracts.length, sent };
}
