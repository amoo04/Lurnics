export type CampaignAudience = "all_customers" | "active_customers";
export type CampaignStatus = "draft" | "sent";

export interface EmailCampaign {
  id: string;
  businessId: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  ctaUrl: string | null;
  audience: CampaignAudience;
  status: CampaignStatus;
  sentAt: string | null;
  createdAt: string;
  sent: number;
  openRate: number;
  clickRate: number;
  conversions: number;
  revenue: number;
}

export interface EmailCampaignListResult {
  items: EmailCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmailStats {
  sent: number;
  openRate: number;
  clickRate: number;
  conversions: number;
  revenue: number;
  unsubscribes: number;
}

export interface CreateCampaignInput {
  name: string;
  subject: string;
  html: string;
  text: string;
  ctaUrl?: string;
  audience?: CampaignAudience;
}
