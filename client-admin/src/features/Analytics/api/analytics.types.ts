export interface LeadsFunnelRow {
  status: string;
  count: number;
}

export interface LeadsOverTimePoint {
  month: string;
  count: number;
}

export interface LeadsBySourceRow {
  source: string;
  count: number;
}

export interface LeadsByServiceRow {
  service: string;
  count: number;
  wonCount: number;
  conversionRate: number;
}
