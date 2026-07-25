import { apiGet } from "../../lib/api";
import type { EmailTemplate } from "../api/email-templates.types";

export function fetchEmailTemplates(category?: string) {
  const qs = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  return apiGet<EmailTemplate[]>(`/api/platform/email-templates${qs}`);
}
