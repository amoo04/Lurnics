export interface RevenuePoint {
  month: string;
  total: number;
}

export interface ProjectStatusCount {
  status: string;
  count: number;
}

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  user: { name: string } | null;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
