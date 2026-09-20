export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  industry: string | null;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateClientInput {
  companyName: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  address?: string;
  industry?: string;
  status?: ClientStatus;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export type ClientEmailType = "newsletter" | "pitch" | "update" | "custom";

export interface SendClientEmailInput {
  type: ClientEmailType;
  subject: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}
