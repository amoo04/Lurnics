import { apiGet } from "../../lib/api";
import type { SeoAudit } from "../api/seo.types";

export function fetchSeoAudit() {
  return apiGet<SeoAudit>("/api/platform/seo/audit");
}
