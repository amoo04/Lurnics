export interface SeoChecklistItem {
  id: string;
  label: string;
  passCount: number;
  failCount: number;
}

export interface SeoRecommendation {
  label: string;
  detail: string;
  affectedPages: string[];
}

export interface SeoAudit {
  score: number;
  totalPages: number;
  checksPassed: number;
  checksTotal: number;
  criticalIssues: number;
  warnings: number;
  checklist: SeoChecklistItem[];
  recommendations: SeoRecommendation[];
}
