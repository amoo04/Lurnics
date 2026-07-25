export type MaintenanceStatus = "active" | "expiring_soon" | "overdue" | "cancelled";

export interface MaintenanceContract {
  id: string;
  clientId: string;
  projectId: string | null;
  planType: string;
  amount: number;
  startDate: string;
  expiryDate: string;
  status: MaintenanceStatus;
  autoReminder: boolean;
  client?: { id: string; companyName: string } | null;
  project?: { id: string; projectName: string } | null;
}

export interface CreateMaintenanceInput {
  clientId: string;
  projectId?: string;
  planType: string;
  amount: number;
  startDate: string;
  expiryDate: string;
  status: MaintenanceStatus;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const MAINTENANCE_PLANS = [
  { name: "Starter", price: 100000, features: ["Security Updates", "Bug Fixes", "Monitoring", "Email Support"], highlight: false },
  { name: "Gold", price: 250000, features: ["Everything in Starter", "Content Updates", "Priority Support", "Monthly Review"], highlight: true },
  { name: "Platinum", price: 500000, features: ["Everything in Gold", "New Features (2/mo)", "Performance Optimization", "Dedicated Support"], highlight: false },
];
