import { apiPost } from "../../lib/api";
import type { CreateLeadInput } from "../api/leads.types";

export async function submitLead(input: CreateLeadInput) {
  return apiPost("/api/leads", input);
}
