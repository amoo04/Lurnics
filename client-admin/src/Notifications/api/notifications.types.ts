export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  notificationType: string;
  readStatus: boolean;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
