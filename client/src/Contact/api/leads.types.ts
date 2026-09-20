export interface CreateLeadInput {
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  budgetRange?: string;
  source?: string;
  service?: string;
}
