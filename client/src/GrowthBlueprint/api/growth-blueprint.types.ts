export type BusinessModel = "B2B" | "B2C" | "Marketplace" | "Subscription" | "Other";

export interface GrowthBlueprintInput {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  industry: string;
  country: string;
  employees: string;
  revenueRange?: string;
  yearsInBusiness?: string;
  businessModel: BusinessModel;
  goals: string[];
  currentChannels?: string[];
  monthlyBudget?: string;
  hasWebsite?: boolean;
  hasLandingPages?: boolean;
  hasCrm?: boolean;
  hasEmailAutomation?: boolean;
  hasAnalytics?: boolean;
  challenges: string[];
}

export interface GrowthBlueprintSubmission extends GrowthBlueprintInput {
  id: string;
  leadId: string | null;
  status: "pending" | "generated" | "sent";
  blueprint: string | null;
  generatedAt: string | null;
  createdAt: string;
}
