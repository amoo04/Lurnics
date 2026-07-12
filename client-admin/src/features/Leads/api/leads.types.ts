export type LeadStatus = "new" | "contacted" | "proposal_sent" | "won" | "lost";

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  budgetRange: string | null;
  source: string | null;
  status: LeadStatus;
  createdAt: string;
}

export interface CreateLeadInput {
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  budgetRange?: string;
  source?: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const LEAD_STAGES: { value: LeadStatus; label: string; dotColor: string }[] = [
  { value: "new", label: "New", dotColor: "bg-indigo-400" },
  { value: "contacted", label: "Contacted", dotColor: "bg-blue-400" },
  { value: "proposal_sent", label: "Proposal Sent", dotColor: "bg-orange-400" },
  { value: "won", label: "Won", dotColor: "bg-green-400" },
  { value: "lost", label: "Lost", dotColor: "bg-gray-400" },
];
