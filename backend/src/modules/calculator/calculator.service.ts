import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { NotFoundError } from "../../middleware/error.js";
import { notify } from "../notifications/notifications.service.js";
import { findActiveUserIds } from "../users/users.repository.js";
import {
  createCalculatorSubmission,
  findCalculatorSubmissionById,
  findCalculatorSubmissions,
} from "./calculator.repository.js";
import type { CreateCalculatorSubmissionInput } from "./calculator.schema.js";

const WEEKS_PER_MONTH = 4.33;
const COLD_LEAD_CLOSE_RATE = 0.25;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function submitCalculatorResult(input: CreateCalculatorSubmissionInput) {
  const monthlyHours = input.hoursPerWeek * WEEKS_PER_MONTH;
  const monthlyTimeCost = round2(monthlyHours * input.hourlyValue);

  const inquiriesPerMonth = input.inquiriesPerWeek * WEEKS_PER_MONTH;
  const coldPerMonth = inquiriesPerMonth * (input.coldPercent / 100);
  const monthlyRevenueLost = round2(coldPerMonth * COLD_LEAD_CLOSE_RATE * input.orderValue);

  const totalMonthlyCost = round2(monthlyTimeCost + monthlyRevenueLost);

  const submission = await createCalculatorSubmission({
    email: input.email,
    mode: input.mode,
    currency: input.currency,
    hoursPerWeek: input.hoursPerWeek,
    inquiriesPerWeek: input.inquiriesPerWeek,
    coldPercent: input.coldPercent,
    orderValue: input.orderValue,
    hourlyValue: input.hourlyValue,
    monthlyTimeCost,
    monthlyRevenueLost,
    totalMonthlyCost,
  });

  const userIds = await findActiveUserIds();
  await Promise.all(
    userIds.map((userId) =>
      notify(
        userId,
        "New growth calculator lead",
        `${input.email} used the manual-work calculator (${input.mode}) - estimated cost ${input.currency} ${Math.round(totalMonthlyCost).toLocaleString()}/mo.`,
        "lead",
      ),
    ),
  );

  return submission;
}

export async function listCalculatorSubmissions(query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findCalculatorSubmissions(pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getCalculatorSubmission(id: string) {
  const submission = await findCalculatorSubmissionById(id);
  if (!submission) throw new NotFoundError("Calculator submission not found");
  return submission;
}
