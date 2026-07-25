export interface RequirementsGeneratorInput {
  companyName?: string;
  contactName: string;
  email: string;
  projectType: string;
  goal: string;
  mustHaveFeatures: string[];
  niceToHaveFeatures?: string[];
  targetUsers?: string;
  timeline: string;
  budgetRange?: string;
}

export interface RequirementsGeneratorSubmission extends RequirementsGeneratorInput {
  id: string;
  leadId: string | null;
  createdAt: string;
}
