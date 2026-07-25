export interface GrowthBlueprintSubmission {
  id: string;
  leadId: string | null;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  website: string | null;
  industry: string;
  country: string;
  employees: string;
  revenueRange: string | null;
  yearsInBusiness: string | null;
  businessModel: string;
  goals: string[];
  currentChannels: string[];
  monthlyBudget: string | null;
  hasWebsite: boolean;
  hasLandingPages: boolean;
  hasCrm: boolean;
  hasEmailAutomation: boolean;
  hasAnalytics: boolean;
  challenges: string[];
  status: "pending" | "generated" | "sent";
  blueprint: string | null;
  generatedAt: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
