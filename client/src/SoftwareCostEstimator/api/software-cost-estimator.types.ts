export interface SoftwareCostEstimatorInput {
  companyName?: string;
  contactName: string;
  email: string;
  projectType: string;
  platforms: string[];
  features: string[];
  needsDesign?: boolean;
  timeline: string;
  budgetRange?: string;
}

export interface SoftwareCostEstimatorSubmission extends SoftwareCostEstimatorInput {
  id: string;
  leadId: string | null;
  createdAt: string;
}
