export type CustomerStatus = "active" | "inactive" | "blocked";

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string | null;
  status: CustomerStatus;
  tags: string | null;
  notes: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export interface CustomerListResult {
  items: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  totalSpent: number;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  status?: CustomerStatus;
  tags?: string;
  notes?: string;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
