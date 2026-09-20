import { apiGet, apiPost } from "../../lib/api";
import type {
  CreateCampaignInput,
  EmailCampaign,
  EmailCampaignListResult,
  EmailStats,
} from "../api/email-campaigns.types";

export function fetchCampaigns(params: { page?: number }) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  const qs = query.toString();
  return apiGet<EmailCampaignListResult>(`/api/platform/email-campaigns${qs ? `?${qs}` : ""}`);
}

export function fetchEmailStats() {
  return apiGet<EmailStats>("/api/platform/email-campaigns/stats");
}

export function createCampaign(input: CreateCampaignInput) {
  return apiPost<EmailCampaign>("/api/platform/email-campaigns", input);
}

export function sendCampaign(id: string) {
  return apiPost<EmailCampaign>(`/api/platform/email-campaigns/${id}/send`);
}
